/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
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
        this.setPosition(x + 15, y);
        this.setVelocityY(-550);
        break;
      case 'down':
        this.setPosition(x - 15, y);
        this.setVelocityY(550);
        break;
      case 'left':
        this.setPosition(x, y + 12);
        this.setVelocityX(-550);
        break;
      case 'right':
        this.setPosition(x, y + 12);
        this.setVelocityX(550);
        break;
    }
  }

  onFireGamepad(x, y, gamepad) {
    if (gamepad.id.indexOf('Xbox Wireless Controller') > -1) {
      if (gamepad.buttons[3].pressed) {
        return this.fireBullet(x, y, 'up')
      } else if (gamepad.A) {
        return this.fireBullet(x, y, 'down')
      }
      if (gamepad.buttons[2].pressed) {
        return this.fireBullet(x, y, 'left')
      } else if (gamepad.B) {
        return this.fireBullet(x, y, 'right')
      }
    }
    if (gamepad.buttons[4].pressed) {
      return this.fireBullet(x, y, 'up')
    } else if (gamepad.A) {
      return this.fireBullet(x, y, 'down')
    }
    if (gamepad.buttons[3].pressed) {
      this.fireBullet(x, y, 'left')
    } else if (gamepad.B) {
      this.fireBullet(x, y, 'right')
    }
  }
  onFireKeyboard(x, y, fireKeys) {
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
    this.explosion = this.scene.add.sprite(this.x, this.y, 'explosion')
    .setScale(0.8)
    .play('explode');
    this.disableBody();
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
  }
}