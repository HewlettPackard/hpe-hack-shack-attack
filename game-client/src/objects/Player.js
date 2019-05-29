import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    this.scene = scene;
    this.lives = 3;
    this.immune = false;

    this.setScale(0.6);

    this.playerFlicker = this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 200,
      paused: true
    });
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

  }
  update(moveKeys, gamepad) {
    if (gamepad) {
      this.onMoveGamepad(gamepad);
    } else {
      this.onMoveKeyboard(moveKeys);
    }
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.anims.stop();
    }
    this.constrainVelocity(this, 400);
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
      this.scene.events.emit('gameover');
    }
  }
  handleAnimation(x, y, gamepad) {
    if (gamepad.A) {
      this.play('playerDown', true);
    } else if (gamepad.B) {
      this.play('playerRight', true);
    } else if (gamepad.buttons[3].pressed) {
      this.play('playerLeft', true);
    } else if (gamepad.buttons[4].pressed) {
      this.play('playerUp', true);
    } else {
      if (Math.abs(x) > Math.abs(y)) {
        if (x < 0 ) {
          this.play('playerLeft', true);
        }
        if (x > 0) {
          this.play('playerRight', true);
        }
      } else if (Math.abs(y) > Math.abs(x)) {
        if (y > 0) {
          this.play('playerDown', true);
        }
        if (y < 0) {
          this.play('playerUp', true);
        }
      }
    }
  }
  onMoveGamepad(gamepad) {
    this.setVelocity(0);
    if (gamepad.axes.length) {
      let x = gamepad.axes[0].getValue();
      let y = gamepad.axes[1].getValue();
      this.setVelocityX(400 * x);
      this.setVelocityY(400 * y);
      this.handleAnimation(x, y, gamepad);
    }
  }

  onMoveKeyboard(moveKeys) {
    this.setVelocity(0);
    if (moveKeys.up.isDown) {
      this.setVelocityY(-400);
      this.play('playerUp', true);
    } else if (moveKeys.down.isDown) {
      this.setVelocityY(400);
      this.play('playerDown', true);
    }
    if (moveKeys.left.isDown) {
      this.setVelocityX(-400);
      this.play('playerLeft', true);
    } else if (moveKeys.right.isDown) {
      this.setVelocityX(400);
      this.play('playerRight', true);
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