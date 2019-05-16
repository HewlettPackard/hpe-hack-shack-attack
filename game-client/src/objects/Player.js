import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    this.scene = scene;
    this.lives = 3;
    this.immune = false;

    this.setScale(0.5);

    this.playerFlicker = this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 200,
      paused: true
    });
    this.up = this.scene.anims.create({
      key: 'up',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 3, end: 3 }),
      repeat: -1,
      frameRate: 10
    });
    this.down = this.scene.anims.create({
      key: 'down',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
      repeat: -1,
      frameRate: 10
    });
    this.left = this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 2, end: 2 }),
      repeat: -1,
      frameRate: 10
    });
    this.right = this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('player', { start: 1, end: 1 }),
      repeat: -1,
      frameRate: 10
    });
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

  }
  update(moveKeys, gamepad) {
    this.onMove(moveKeys, gamepad);
    this.constrainVelocity(this, 350);
    this.animateInvincibility();
  }
  animateInvincibility() {
    if (this.immune === true) {
      this.playerFlicker.resume();
    } else {
      this.playerFlicker.pause();
      this.setAlpha(1);
    }
  }
  onHit(damage, livesText) {
    if (this.immune === false) {
      this.lives -= damage;
      livesText.setText(`Lives:${this.lives}`);
      this.scene.cameras.main.shake(120);
      this.immune = true;
  
      this.scene.time.addEvent({
        delay: 1500,
        callback: () => {
          this.immune = false;
        }
      });
    }
    if (this.lives <= 0) {
      livesText.setText(`Lives:0`);
      this.disableBody();
      this.scene.cameras.main.fade(2000);
      this.scene.cameras.main.on('camerafadeoutcomplete', () => this.scene.events.emit('gameover'));
    }
  }
  handleAnimation(x, y) {
    // if y is greater choose up or down
    // if x is greater choose left or right
    if (Math.abs(x) > Math.abs(y)) {
      if (x < 0 ) {
        this.play('left');
      }
      if (x > 0) {
        this.play('right');
      }
    } else {
      if (y > 0) {
        this.play('down');
      }
      if (y < 0) {
        this.play('up');
      }
    }
  }
  onMove(moveKeys, gamepad) {
    this.setVelocity(0);
    if (gamepad.axes.length) {
      let x = gamepad.axes[0].getValue();
      let y = gamepad.axes[1].getValue();
      this.setVelocityX(350 * x);
      this.setVelocityY(350 * y);

      this.handleAnimation(x, y);
    }
    if (moveKeys.up.isDown) {
      this.setVelocityY(-350);
    } else if (moveKeys.down.isDown) {
      this.setVelocityY(350);
    }
    if (moveKeys.left.isDown) {
      this.setVelocityX(-350);
    } else if (moveKeys.right.isDown) {
      this.setVelocityX(350);
    }
  }

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
}