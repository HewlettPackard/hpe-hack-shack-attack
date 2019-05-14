import 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');

    this.scene = scene;
    this.gameWidth = this.scene.game.config.width;
    this.gameHeight = this.scene.game.config.height;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  update() {
    if (this.x > this.gameWidth + 100 || this.x < -100) {
      this.onHit();
    } 
    if (this.y > this.gameHeight + 100 || this.y < -100) {
      this.onHit()
    }
  }
  fireBullet(x, y, direction) {
    this.enableBody(true);
    this.setActive(true);
    this.setVisible(true);

    switch (direction) {
      case 'up':
        this.setPosition(x + 10, y);
        this.setVelocityY(-550);
        break;
      case 'down':
        this.setPosition(x - 10, y);
        this.setVelocityY(550);
        break;
      case 'left':
        this.setPosition(x, y - 10);
        this.setVelocityX(-550);
        break;
      case 'right':
        this.setPosition(x, y + 10);
        this.setVelocityX(550);
        break;
    }
  }

  onFire(x, y, fireKeys, gamepad) {
    if (fireKeys.up.isDown || gamepad.buttons[4].pressed) {
      this.fireBullet(x, y, 'up')
    } else if (fireKeys.down.isDown || gamepad.A) {
      this.fireBullet(x, y, 'down')
    }
    if (fireKeys.left.isDown || gamepad.buttons[3].pressed) {
      this.fireBullet(x, y, 'left')
    } else if (fireKeys.right.isDown || gamepad.B) {
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