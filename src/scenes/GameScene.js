/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import 'phaser';
import ItBug from '../objects/ItBug';
import ItMonster from '../objects/ItMonster';
import Player from '../objects/Player';
import Bullet from '../objects/Bullet';
import PowerUp from '../objects/PowerUp';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  init() {
    this.gamepad;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
    this.spawnTimerBug = 0;
    this.spawnTimerMonster = 0;
    this.bulletTimer = 0;
    this.collisionDamage = 1
    this.spawnSide = ['left', 'right', 'bottom'];
    this.powerUpTimer = 0;
    this.powerUpCount = 0;
    this.dead = false;
    this.disableFire = false;
    this.score = 0;
    this.startRound = false;

    // Track games played
    gtag('event', 'start game');
  }
  create() {
    this.map = this.add.sprite(this.width / 2, this.height / 2, 'map').setScale(1.2);

    this.fireKeys = this.input.keyboard.createCursorKeys();
    this.moveKeys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    this.startText = this.add.bitmapText(this.width / 2, this.height / 2 - 200, 'arcadeFont', '', 100)
    .setTint(0xFFFFFF)
    .setOrigin(0.5, 0.5);


    this.countdown();
    this.createWallsandBorders();
    this.createGroups();
    this.createPlayer();
    this.addCollisions();
    this.setupEvents();
    this.physics.world.setBounds(0, 200, this.width, this.height - 200);
    this.playerAvatar = this.add.sprite(this.width - 345, 35, 'playerAvatar')
      .setScale(0.8)
      .setDepth(1);
    this.scoreText = this.add.bitmapText(50, 20, 'arcadeFont', 'Score:0', 35)
      .setTint(0xFFFFFF)
      .setDepth(1);
    this.livesText = this.add.bitmapText(this.width - 300, 20, 'arcadeFont', `Lives:${this.player.lives}`, 35)
      .setTint(0xFFFFFF)
      .setDepth(1);

  }
  setupEvents() {
    this.events.on('gameover', () => {
      this.events.removeListener('gameover');
      this.events.removeListener('updateScore');
      this.events.removeListener('gotPowerUp');
      this.cameras.main.fade(2000);
      this.dead = true;
      this.cameras.main.on('camerafadeoutcomplete', () => {
        this.scene.start('GameOver', { score: this.score })
      });
    });
    this.events.on('updateScore', (points) => {
      this.score += points;
      this.scoreText.setText(`Score:${this.score}`);
    });
    this.events.on('gotPowerUp', () => {
      this.powerUpCount = 0;
      this.disableFire = true;

      this.powerUpCollect = this.add.sprite(this.player.x, this.player.y, 'powerUpCollect')
      .setScale(0.6)
      .play('powerUpCollect');

      this.player.disableBody();
      this.player.setActive(false);
      this.player.setVisible(false);

      this.itMonsters.getChildren().map((child) => {
        child.kill();
      });
      this.itBugs.getChildren().map((child) => {
        child.kill();
      });

      this.powerUpCollect.on('animationcomplete', () => {
        this.disableFire = false;

        this.player.enableBody();
        this.player.setActive(true);
        this.player.setVisible(true);
      });
    });
  }
  createWallsandBorders() {
    this.doorLeft = this.physics.add.sprite(this.width / 2 - 70 , -120)
    this.physics.add.existing(this.doorLeft);
    this.doorLeft.body
      .setSize(10, 600)
      .setImmovable(true);

    this.doorRight = this.physics.add.sprite(this.width / 2 + 70 , -120)
    this.physics.add.existing(this.doorRight);
    this.doorRight.body
      .setSize(10, 600)
      .setImmovable(true);

    this.borderDark = this.add.graphics()
      .fillStyle(0x11141A, 0.8)
      .fillRect(0, this.height / 2 - 345, 50, this.height - 245)
      .fillRect(this.width - 50, this.height / 2 - 345, 50, this.height - 245)
      .fillRect(this.width / 2 - 75, 0, 150, 100)
      .fillRect(0, this.height - 50, this.width, 50)
      .setDepth(2);
    this.borderLight = this.add.graphics()
      .fillStyle(0x11141A, 0.8)
      .fillRect(0, this.height / 2 - 345, 75, this.height - 245)
      .fillRect(this.width - 75, this.height / 2 - 345, 75, this.height - 245)
      .fillRect(this.width / 2 - 75, 0, 150, 125)
      .fillRect(0, this.height - 75, this.width, 75)
      .setDepth(2);
  }
  createGroups() {
    this.itBugs = this.physics.add.group({ classType: ItBug });
    this.itMonsters = this.physics.add.group({ classType: ItMonster });
    this.bullets = this.physics.add.group({ classType: Bullet , runChildUpdate: true });
    this.powerUps = this.physics.add.group({ classType: PowerUp });
  }
  addCollisions() {
    this.physics.add.collider(this.itBugs, this.itBugs);
    this.physics.add.collider(this.itMonsters, this.itMonsters);
    this.physics.add.collider(this.itMonsters, this.itBugs);

    this.physics.add.collider(this.itMonsters, this.doorLeft);
    this.physics.add.collider(this.itMonsters, this.doorRight);

    this.physics.add.overlap(this.player, this.itBugs, () => this.player.onHit(this.collisionDamage, this.livesText), this.checkEnemyCollision, this);
    this.physics.add.overlap(this.itBugs, this.bullets, this.bulletCollision, this.checkBulletCollision, this);

    this.physics.add.overlap(this.player, this.itMonsters, () => this.player.onHit(this.collisionDamage, this.livesText), this.checkEnemyCollision, this);
    this.physics.add.overlap(this.itMonsters, this.bullets, this.bulletCollision, this.checkBulletCollision, this);

    this.physics.add.overlap(this.player, this.powerUps, this.powerUpCollision, this.checkEnemyCollision, this);
  }
  createPlayer() {
    this.player = new Player(this, this.width / 2 - 5, this.height / 2);
    this.player.setCollideWorldBounds(true)
      .setSize(60, 80, true)
      .setOffset(10, 18);
  }
  update(time) {
    if (this.input.gamepad.total > 0 ) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startRound) {
      this.player.update(this.moveKeys, this.gamepad);
      if (this.gamepad) {
        if (!this.dead && !this.disableFire) {
          this.fireBulletsGamepad(time, this.gamepad);
        } else {
          this.bulletTimer = time;
        }
      } else {
        this.fireBulletsKeyboard(time, this.fireKeys);
      }
      this.spawnitBug(time);
      this.spawnitMonster(time);
      this.addPowerUp(time);

      Phaser.Utils.Array.Each(
        this.itBugs.getChildren(),
        this.physics.moveToObject,
        this.physics,
        this.player, 225);

      Phaser.Utils.Array.Each(
        this.itMonsters.getChildren(),
        this.physics.moveToObject,
        this.physics,
        this.player, 150);
        
    } else {
      this.spawnTimerBug = time;
      this.bulletTimer = time;
      this.powerUpTimer = time + 15000;
      this.spawnTimerMonster = time + 2500;
    }
  }
  countdown() {
    if (!this.startRound) {
      const startTimer = this.time.addEvent({
        delay: 1000,
        repeat: 4,
        callback: () => {
          this.startText.setText(`${startTimer.repeatCount - 1}`);
          if (startTimer.repeatCount === 1) {
            this.startText.setText(`GO!`)
              .setX(this.width / 2 + 20);
            this.startRound = true;
          }
          if (startTimer.repeatCount === 0) {
            this.startText.setAlpha(0);
          }
        }
      });
    }
  }
  fireBulletsGamepad(time, gamepad) {
    if (time > this.bulletTimer) {
      if (gamepad.A || gamepad.B || gamepad.buttons[3].pressed || gamepad.buttons[4].pressed) {
        let bullet = this.bullets.getFirstDead(false);
        if (!bullet) {
          bullet = new Bullet(this, 0, 0);
          this.bullets.add(bullet);
        }
        if (bullet) {
          bullet.onFireGamepad(this.player.x, this.player.y, gamepad);
          this.bulletTimer += 200;
        }
      } else {
        this.bulletTimer += 200;
      }     
    }
  }
  fireBulletsKeyboard(time, key) {
    if (time > this.bulletTimer) {
      if (key.up.isDown || key.down.isDown || key.right.isDown || key.left.isDown) {
        let bullet = this.bullets.getFirstDead(false);
        if (!bullet) {
          bullet = new Bullet(this, 0, 0);
          this.bullets.add(bullet);
        }
        if (bullet) {
          bullet.onFireKeyboard(this.player.x, this.player.y, key);
          this.bulletTimer += 200;
        }
      } else {
        this.bulletTimer += 200;
      }     
    }
  }
  spawnitBug(time) {
    if (time > this.spawnTimerBug) {
      let itBug = this.itBugs.getFirstDead(false);
      if (!itBug) {
        itBug = new ItBug(this, 0, 0);
        this.itBugs.add(itBug);
      }
      if (itBug) {
        let coords = this.getSpawnPos();
        itBug.setActive(true)
          .setVisible(true)
          .setScale(0.6)
          .enableBody()
          .setCircle(30, 18, 50)
          .spawn(coords.x, coords.y);
        let newTime = Phaser.Math.Between(600, 1000);
        this.spawnTimerBug = time + newTime;
      }
    }
  }
  addPowerUp(time) {
    if (this.powerUpCount === 0) {
      if (time > this.powerUpTimer) {
        let powerUp = this.powerUps.getFirstDead(false);
        if (!powerUp) {
          powerUp = new PowerUp(this, 0, 0);
          this.powerUps.add(powerUp);
        }
        if (powerUp) {
          this.powerUpCount = 1;
          let x = Phaser.Math.Between(100, this.width - 100);
          let y = Phaser.Math.Between(250, this.height - 100);
          powerUp.setActive(true)
            .setVisible(true)
            .enableBody()
            .setScale(0.7)
            .setSize(75, 75, true)
            .setOffset(10, 15)
            .spawn(x, y);
          this.powerUpTimer += 35000;
        }
      }
    } else {
      this.powerUpTimer = time + 35000;
    }
  }
  spawnitMonster(time) {
    if (time > this.spawnTimerMonster) {
      let itMonster = this.itMonsters.getFirstDead(false);
      if (!itMonster) {
        itMonster = new ItMonster(this, 0, 0);
        this.itMonsters.add(itMonster);
      }
      if (itMonster) {
        itMonster.setActive(true)
          .setVisible(true)
          .setSize(75, 80)
          .enableBody()
          .spawn(this.width / 2, - 100);
        let newTime = Phaser.Math.Between(1800, 2800);
        this.spawnTimerMonster = time + newTime;
      }
    }
  }
  getSpawnPos() {
    let index = Math.floor(Math.random() * 3);
    let x;
    let y;
    switch(this.spawnSide[index]){
      case('left'):
        x = Phaser.Math.Between(-100, -120);
        y = Phaser.Math.Between(100, this.height);
        return { x, y };
      case('right'):
        x = Phaser.Math.Between(this.width + 100, this.width + 120);
        y = Phaser.Math.Between(100, this.height);
        return { x, y };
      case('bottom'):
        x = Phaser.Math.Between(0, this.width);
        y = Phaser.Math.Between(this.height + 100, this.height + 120);
        return { x, y };
    }
  }
  checkBulletCollision(bullet, enemy) {
    return (bullet.active && enemy.active);
  }
  checkEnemyCollision(player, enemy) {
    return (player.active && enemy.active);
  }
  bulletCollision(enemy, bullet) {
    enemy.onHit(1);
    bullet.onHit();
  }
  powerUpCollision(player, powerUp) {
    powerUp.onHit(player, this.gamepad);
  }
}
