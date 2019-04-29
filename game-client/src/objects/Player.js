import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'pixel');

    this.scene = scene;
    this.lives = 3;
    this.immune = false;

    this.setScale(2);

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
  update(moveKeys) {
    this.onMove(moveKeys);
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
      this.scene.cameras.main.shake(300);
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
  onMove(moveKeys) {
    this.setVelocity(0);
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