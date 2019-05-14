import 'phaser';

export default class ItMonster extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'itMonster');

    this.scene = scene;
    this.hp = 0;

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.death = this.scene.anims.create({
      key: 'death',
      frames: this.scene.anims.generateFrameNumbers('monsterDeath', { start: 0, end: 5 }),
      frameRate: 30,
      repeat: 0,
    });
  }
  spawn(x, y) {
    this.hp = 3;
    this.setPosition(x, y);
  }

  onHit(damage) {
    this.hp -= damage;

    if (this.hp <= 0) {
      this.scene.add.sprite(this.x, this.y, 'monsterDeath')
      .setScale(4)
      .play('death');

      this.setActive(false);
      this.setVisible(false);
      this.disableBody();
      this.scene.events.emit('updateScore')
    }
  }
}