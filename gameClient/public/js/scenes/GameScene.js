
class GameScene extends Phaser.Scene {
  constructor() {
    super({ 
      key: 'GameScene',
      physics: {
        default: 'arcade',
        arcade: { 
          debug: false 
        }
      },
    })
    this.player;
    this.bullets;
    this.ghosts;
    this.spawnTimer = 0;
    this.lastFired = 0
    this.score = 0;
    this.gameOver = false;
  }
  preload() {
    this.load.image('pixel', 'assets/sprites/16x16.png');
    this.load.image('ghost', 'assets/sprites/ghost.png');
    this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
  }
  create() {
    
    // set worldbounds
    this.physics.world.setBounds(0, 0, 640, 360);
    // score
    this.scoreText = this.add.bitmapText(10, 10, 'arcade', `SCORE:${this.score}`, 12).setTint(0xFF875FD8);    

    // create player character
    let player = this.physics.add.sprite(310, 170, 'pixel');
    player.setCollideWorldBounds(true);
    this.player = player;

    // create enemies
    let ghosts = this.physics.add.group();
    ghosts.createMultiple({
      frameQuantity: 30,
      key: 'ghost',
      active: false,
      visible: false,
    });
    this.ghosts = ghosts;

    // create bullet
    let bullets = this.physics.add.group();
    bullets.createMultiple({
      frameQuantity: 50,
      key: 'pixel',
      active: false,
      visible: false
    });
    this.bullets = bullets;
      
    // create bullet fire keys
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    // create move inputs WSAD keys
    let moveKeys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D
    });

     // Enables movement of player with WASD keys
    this.input.keyboard.on('keydown_W', function (event) {
        player.setAccelerationY(-800);
    });
    this.input.keyboard.on('keydown_S', function (event) {
        player.setAccelerationY(800);
    });
    this.input.keyboard.on('keydown_A', function (event) {
        player.setAccelerationX(-800);
    });
    this.input.keyboard.on('keydown_D', function (event) {
        player.setAccelerationX(800);
    });

    // Stops player Acceleration on release of WASD keys
    this.input.keyboard.on('keyup_W', function (event) {
        if (moveKeys['down'].isUp) {
          player.setVelocityY(0);
          player.setAccelerationY(0);
          
        }
    });
    this.input.keyboard.on('keyup_S', function (event) {
        if (moveKeys['up'].isUp) {
          player.setVelocityY(0);
          player.setAccelerationY(0);
        }
    });
    this.input.keyboard.on('keyup_A', function (event) {
        if (moveKeys['right'].isUp) {
          player.setAccelerationX(0);
          player.setVelocityX(0);
        }
    });
    this.input.keyboard.on('keyup_D', function (event) {
        if (moveKeys['left'].isUp) {
          player.setAccelerationX(0);
          player.setVelocityX(0);
        }
    });
    // add collisions
    this.physics.add.collider(this.ghosts, this.ghosts);
    this.physics.add.overlap(this.player, this.ghosts, this.enemyCollision, this.checkEnemyCollision, this);
    this.physics.add.overlap(this.ghosts, this.bullets, this.bulletCollision, this.checkBulletCollision, this);
  }
  update(time) {

    // ghosts follow player
    Phaser.Utils.Array.Each(
      this.ghosts.getChildren(),
      this.physics.moveToObject,
      this.physics,
      this.player, 50);

    // Constrain velocity of player
    this.constrainVelocity(this.player, 300);
    if (time > this.spawnTimer) {
      this.spawnGhosts();
      this.spawnTimer = time + 700;
    }
    // fire bullets on keypress
    if(this.upKey.isDown && time > this.lastFired) {
      this.fireBullets('up');
      this.lastFired = time + 100;
    }
    if(this.downKey.isDown && time > this.lastFired) {
      this.fireBullets('down');
      this.lastFired = time + 100;
    }
    if(this.leftKey.isDown && time > this.lastFired) {
      this.fireBullets('left');
      this.lastFired = time + 100;
    }
    if(this.rightKey.isDown && time > this.lastFired) {
      this.fireBullets('right');
      this.lastFired = time + 100;
  }
  if(this.gameOver === true) {
    this.gameOver = false;
    this.scene.start('HighScoreScene', { score: this.score});
  }
}

  // Ensures sprite speed doesnt exceed maxVelocity while update is called
  constrainVelocity(sprite, maxVelocity) {
    if (!sprite || !sprite.body) {
      return;
    }
    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * maxVelocity;
      vy = Math.sin(angle) * maxVelocity;
      sprite.body.velocity.x = vx;
      sprite.body.velocity.y = vy;
    }
  }

  fireBullets(direction) {
    const bullet = this.bullets.getFirstDead(false);
    if(bullet) {
      bullet.enableBody(true);
      bullet.active = true;
      bullet.visible = true;
      bullet.setScale(0.4);
      bullet.setPosition(this.player.x, this.player.y);

      switch (direction) {
        case 'up':
          bullet.setVelocityY(-350);
          break;
        case 'down':
          bullet.setVelocityY(350);
          break;
        case 'left':
          bullet.setVelocityX(-350);
          break;
        case 'right':
          bullet.setVelocityX(350);
          break;
      }
      this.time.addEvent({
        delay: 1500,
        callback: () => {
          bullet.disableBody();
          bullet.active = false;
          bullet.visible = false;
          bullet.setVelocity(0);
        }
      });
    }
  }

  spawnGhosts() {
    const ghost = this.ghosts.getFirstDead(false);
    if(ghost) {
      ghost.enableBody(true);
      ghost.setCollideWorldBounds(true);
      ghost.active = true;
      ghost.visible = true;
      ghost.setScale(0.25);
      let xPos = Phaser.Math.Between(0, this.game.config.width);
      let yPos = Phaser.Math.Between(0, this.game.config.height);

      ghost.setPosition(xPos, yPos);
    }
  }
  bulletCollision(bullet, enemy) {
    bullet.active = false;
    bullet.visible = false;
    bullet.disableBody();
    
    enemy.active = false;
    enemy.visible = false;
    enemy.disableBody();

    this.score++;
    this.scoreText.setText(`Score:${this.score}`);
  }
  checkBulletCollision(bullet, enemy) {
    return (bullet.active && enemy.active);
  }
  enemyCollision(player, enemy){
    this.gameOver = true;
  }
  checkEnemyCollision(player, enemy) {
    return (player.active && enemy.active);
  }
}

export default GameScene;