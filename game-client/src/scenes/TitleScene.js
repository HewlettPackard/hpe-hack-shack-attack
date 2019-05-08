import 'phaser';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }
  init () {
    this.selection = 'start';
  }
  create() {
    // keyboard inputs
    this.input.keyboard.on('keyup_UP', this.onChange, this);
    this.input.keyboard.on('keyup_DOWN', this.onChange, this);
    this.input.keyboard.on('keyup_ENTER', this.onSelect, this);
    // logo
    this.gameLogo = this.add.sprite(0, 0, 'gameLogo')
      .setScale(0.8)
    this.centerObject(this.gameLogo, 0, 1.2);
    this.hpeDevLogo = this.add.sprite(0, 0, 'hpeDevLogo')
      .setScale(0.5)
    this.centerObject(this.hpeDevLogo, -4, 3);
    // start select box
    this.startSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(0, 0, 320, 50);
    this.centerObject(this.startSelectionBox, 1.6, -1);
    // attract select box
    this.attractSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(0, 0, 320, 50)
    this.attractSelectionBox.visible = false;
    this.centerObject(this.attractSelectionBox, 1.6, -1.5);
    // play and attract buttons
    this.startButton = this.add.bitmapText(0, 0, 'arcadeFont', 'Start').setTint(0x000000).setInteractive();
    this.centerObject(this.startButton, 0.76, -1.08);
    this.attractButton = this.add.bitmapText(0, 0, 'arcadeFont', 'Attract').setTint(0xFFFFFF).setInteractive();
    this.centerObject(this.attractButton, 1.08, -1.58);
  }
  onChange() {
    if (this.selection === 'start') {
      this.attractSelectionBox.visible = true;
      this.startSelectionBox.visible = false;
      this.attractButton.setTint(0x000000);
      this.startButton.setTint(0xFFFFFF);
      this.selection = 'attract';
    } else {
      this.attractSelectionBox.visible = false;
      this.startSelectionBox.visible = true;
      this.attractButton.setTint(0xFFFFFF);
      this.startButton.setTint(0x000000);
      this.selection = 'start';
    }
  }
  onSelect() {
    if (this.selection === 'start') {
      this.scene.start('Game');
    } else {
      // start attract
     //  this.scene.start('Attract');
    }
  }
  centerObject(gameObject, offsetX = 0, offsetY = 0) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    gameObject.x = width / 2 - offsetX * 100;
    gameObject.y = height / 2 - offsetY * 100
  }
}
