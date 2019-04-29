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
    // logo text
    this.hpeDevImg = this.add.bitmapText(980, 150, 'arcadeFont', 'HPE DEV', 30).setTint(0xFF875FD8);

    this.hackShackImgShadow = this.add.bitmapText(220, 150, 'arcadeFont', 'HACK SHACK', 50).setTint(0xFF333333);
    this.hackShackImg = this.add.bitmapText(215, 145, 'arcadeFont', 'HACK SHACK', 50).setTint(0xFF1FDC83);

    this.attackImgShadow  = this.add.bitmapText(160, 200, 'arcadeFont', 'ATTACK!', 155).setTint(0xFFDE9B29);
    this.attackImg = this.add.bitmapText(155, 195, 'arcadeFont', 'ATTACK!', 155).setTint(0xFFFF4D1C);

    // start select box
    this.startSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(490, 445, 320, 50);

    // attract select box
    this.attractSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(490, 500, 320, 50);
    this.attractSelectionBox.visible = false;
    // play and attract buttons
    this.startButton = this.add.bitmapText(570, 450, 'arcadeFont', 'Start').setTint(0x000000).setInteractive();
    this.attractButton = this.add.bitmapText(540, 505, 'arcadeFont', 'Attract').setTint(0xFFFFFF).setInteractive();
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
  centerObject(gameObject, offset = 0) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    gameObject.x = width / 2;
    gameObject.y = height / 2 - offset * 100
  }
}
