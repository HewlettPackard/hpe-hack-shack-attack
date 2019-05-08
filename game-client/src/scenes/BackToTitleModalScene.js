import 'phaser';

export default class ErrorModalScene extends Phaser.Scene {
  constructor() {
    super('BackToTitleModal');
  }
  init(data) {
    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.selection = 'cancel';
    this.score = data.score;
  }
  create() {
    this.createModal();
    this.leftInput = this.input.keyboard.on('keyup_LEFT', this.onChange, this);
    this.rightInput = this.input.keyboard.on('keyup_RIGHT', this.onChange, this);
    this.select = this.input.keyboard.on('keyup_ENTER', this.onSelect, this);
  }
  update() {

  }
  createModal() {
    this.mask = this.add.graphics()
      .fillStyle(0x000000, 0.5)
      .fillRect(0, 0, this.width, this.height);
    this.border = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 2 - 210, this.height / 2 - 210, 420, 220);
    this.background = this.add.graphics()
      .fillStyle(0x000000, 1)
      .fillRoundedRect(this.width / 2 - 200, this.height / 2 - 200, 400, 200);
      
    this.submitSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 2 - 135, this.height / 2 - 55, 120, 40);
    this.submitSelectionBox.visible = false;
    this.cancelSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 2 - 5, this.height / 2 - 55, 120, 40);

    this.message1 = this.add.bitmapText(this.width / 2 - 180, this.height / 2 - 180, 'arcadeFont', 'Cancel Submitting', 20);
    this.message2 = this.add.bitmapText(this.width / 2 - 180, this.height / 2 - 140, 'arcadeFont', 'your score?', 20);
    this.submitButton = this.add.bitmapText(this.width / 2 - 100, this.height / 2 - 45, 'arcadeFont', 'Yes', 18).setTint(0xFFFFFF);
    this.cancelButton = this.add.bitmapText(this.width / 2, this.height / 2 - 45, 'arcadeFont', 'Cancel', 18).setTint(0x000000);
  }
  onSelect() {
    if (this.selection === 'cancel') {
      this.scene.start('HighScore', { score: this.score });
    } else {
      this.scene.start('Title');
    }
  }
  onChange() {
    if (this.selection === 'submit') {
      this.cancelSelectionBox.visible = true;
      this.submitSelectionBox.visible = false;
      this.cancelButton.setTint(0x000000);
      this.submitButton.setTint(0xFFFFFF);
      this.selection = 'cancel';
    } else {
      this.cancelSelectionBox.visible = false;
      this.submitSelectionBox.visible = true;
      this.cancelButton.setTint(0xFFFFFF);
      this.submitButton.setTint(0x000000);
      this.selection = 'submit';
    }
  }
}