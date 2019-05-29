import 'phaser';

export default class ItBug extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'itBug');

    this.scene = scene;
    this.hp = 0;
    this.points = 1;
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
  }
  spawn(x, y) {
    this.hp = 2;
    this.setPosition(x, y);
    this.play('bounce');
  }

  onHit(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.death = this.scene.add.sprite(this.x, this.y, 'monsterDeath')
      .setScale(1.5)
      .play('death');
      this.setActive(false);
      this.setVisible(false);
      this.disableBody();
      this.scene.events.emit('updateScore', this.points);
    }
  }
  kill() {
    this.death = this.scene.add.sprite(this.x, this.y, 'monsterDeath')
    .setScale(1.5)
    .play('death');
    this.setActive(false);
    this.setVisible(false);
    this.disableBody();
  }
}