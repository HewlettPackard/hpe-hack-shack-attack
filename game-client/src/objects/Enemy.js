import 'phaser';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'ghost');

    this.scene = scene;
    this.hp = 0;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  spawn(x, y) {
    this.hp = 2;
    this.setPosition(x, y);
  }

  onHit(damage) {
    this.hp -= damage;

    if (this.hp <= 0) {
      this.setActive(false);
      this.setVisible(false);
      this.disableBody();
      this.scene.events.emit('updateScore')
    }
  }
}