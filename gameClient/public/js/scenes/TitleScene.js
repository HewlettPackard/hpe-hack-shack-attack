class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' })
  }
  preload() {
    // preload fonts, and images
    this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
  }
  create() {
    // create title screen text
    this.add.bitmapText(450, 55, 'arcade', 'HPE DEV', 12).setTint(0xFF875FD8);

    this.add.bitmapText(128, 83, 'arcade', 'HACK SHACK', 20).setTint(0xFF333333);
    this.add.bitmapText(125, 80, 'arcade', 'HACK SHACK', 20).setTint(0xFF1FDC83);

    this.add.bitmapText(105, 105, 'arcade', 'ATTACK!', 65).setTint(0xFFDE9B29);
    this.add.bitmapText(100, 100, 'arcade', 'ATTACK!', 65).setTint(0xFFFF4D1C);

    // start text message and tween
    this.startText = this.add.bitmapText(190, 300, 'arcade', 'Press any button to begin', 10).setTint(0xFFFFFFFF);

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
    this.scene.start('GameScene');
  }
}

export default TitleScene;