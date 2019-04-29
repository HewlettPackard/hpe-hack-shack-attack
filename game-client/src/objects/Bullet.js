import 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'pixel');

    this.scene = scene;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  update(time, delta) {

  }

  fireBullet(x, y, direction) {
    this.enableBody(true);
    this.setActive(true);
    this.setVisible(true);

    switch (direction) {
      case 'up':
        this.setPosition(x, y);
        this.setVelocityY(-350);
        break;
      case 'down':
        this.setPosition(x, y);
        this.setVelocityY(350);
        break;
      case 'left':
        this.setPosition(x, y);
        this.setVelocityX(-350);
        break;
      case 'right':
        this.setPosition(x, y);
        this.setVelocityX(350);
        break;
    }
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.disableBody();
        this.setActive(false);
        this.setVisible(false);
        this.setVelocity(0);
      }
    });
  }

  onFire(x, y, fireKeys) {
    if (fireKeys.up.isDown) {
      this.fireBullet(x, y, 'up')
    } else if (fireKeys.down.isDown) {
      this.fireBullet(x, y, 'down')
    }
    if (fireKeys.left.isDown) {
      this.fireBullet(x, y, 'left')
    } else if (fireKeys.right.isDown) {
      this.fireBullet(x, y, 'right')
    }
  }

  onHit() {
    this.disableBody();
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
  }
}