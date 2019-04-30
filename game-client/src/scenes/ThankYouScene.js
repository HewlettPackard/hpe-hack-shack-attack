import 'phaser';

export default class ThankYouScene extends Phaser.Scene {
  constructor() {
    super('ThankYou')
  }
  init() {
    this.height = this.game.config.height;
    this.width = this.game.config.width;
  }
  create() {
    this.add.bitmapText(this.width / 2, this.height / 2 - 200, 'arcadeFont', 'THANKS FOR PLAYING!', 65).setTint(0xFFFFFF).setOrigin(0.5, 0.5)

    this.startText = this.add.bitmapText(this.width / 2, this.height - 100, 'arcadeFont', 'Press any button to start over', 20).setTint(0xFFFFFFFF).setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: this.startText,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 1200,
    });
  }
  update() {
    if(this.input.activePointer.isDown) {
      this.start_game();
    }
  }
  start_game() {
    this.scene.start('Title');
  }
}