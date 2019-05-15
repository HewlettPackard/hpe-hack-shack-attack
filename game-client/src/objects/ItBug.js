import 'phaser';

export default class ItBug extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'itBug');

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
    this.bounce = this.scene.anims.create({
      key: 'bounce',
      frames: this.scene.anims.generateFrameNumbers('itBug', { start: 0, end: 6 }),
      frameRate: 15,
      repeat: -1,
    });
  }
  spawn(x, y) {
    this.hp = 2;
    this.setPosition(x, y);
    this.play('bounce');
  }

  onHit(damage) {
    this.hp -= damage;

    if (this.hp <= 0) {
      this.scene.add.sprite(this.x, this.y, 'monsterDeath')
      .setScale(1.5)
      .play('death');

      this.setActive(false);
      this.setVisible(false);
      this.disableBody();
      this.scene.events.emit('updateScore')
    }
  }
}