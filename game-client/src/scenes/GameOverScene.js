import 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init (data) {
    this.selection = 'submit';
    this.score = data.score;

    this.height = this.game.config.height;
    this.width = this.game.config.width;
  }

  create() {
    // keyboard inputs
    this.input.keyboard.on('keyup_LEFT', this.onChange, this);
    this.input.keyboard.on('keyup_RIGHT', this.onChange, this);
    this.input.keyboard.on('keyup_ENTER', this.onSelect, this);

    this.gameOverText  = this.add.bitmapText(this.width / 2, this.height / 2 - 250, 'arcadeFont', 'GAME OVER', 80).setTint(0xFFFFFF)
    .setOrigin(0.5, 0.5);
    this.scoreText  = this.add.bitmapText(this.width / 2, this.height / 2 - 160, 'arcadeFont', `You got ${this.score}pts!`, 60).setTint(0xFFFFFF)
    .setOrigin(0.5, 0.5);

    // submit select box
    this.submitSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 3 - 17, this.height / 2 - 10, 220, 50)

    // cancel select box
    this.cancelSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 2 - 17, this.height / 2 - 10, 220, 50)
    this.cancelSelectionBox.visible = false;

    // submit and cancel buttons
    this.submitButton = this.add.bitmapText(this.width / 3, this.height / 2, 'arcadeFont', 'Submit').setTint(0x000000).setInteractive()
    this.cancelButton = this.add.bitmapText(this.width / 2, this.height / 2, 'arcadeFont', 'Cancel').setTint(0xFFFFFF).setInteractive()
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

  onSelect() {
    if (this.selection === 'submit') {
     this.scene.start('HighScore', { score: this.score });
    } else {
     this.scene.start('Title');
    }
  }

  centerObject(gameObject, offset = 0) {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    gameObject.x = width / 2;
    gameObject.y = height / 2 - offset * 100
  }
}