/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import 'phaser';

export default class ItMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'itMonster');

    this.scene = scene;
    this.hp = 0;
    this.points = 3;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  spawn(x, y) {
    this.hp = 3;
    this.setPosition(x, y);
    this.play('walk');
  }

  onHit(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.poof = this.scene.add.sprite(this.x, this.y, 'itMonsterPoof')
      .setScale(1.8)
      .play('poof');
      this.setActive(false);
      this.setVisible(false);
      this.disableBody();
      this.scene.events.emit('updateScore', this.points);
    }
  }
  kill() {
    this.poof = this.scene.add.sprite(this.x, this.y, 'itMonsterPoof')
    .setScale(1.8)
    .play('poof');
    this.setActive(false);
    this.setVisible(false);
    this.disableBody();
  }
}