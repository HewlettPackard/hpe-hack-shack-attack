/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import 'phaser';

export default class BackToTitleScene extends Phaser.Scene {
  constructor() {
    super('BackToTitle');
  }
  init(data) {
    this.gamepad;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.startScene = false;

    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.selection = 'cancel';
    this.score = data.score;
  }
  create() {
    this.countdown();
    this.createScene();
    this.createAnimations();
    this.keyboardInputs();
  }
  update() {
    if (this.input.gamepad.total > 0 ) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startScene) {
      if (this.gamepad) {
        this.gamepadInputs();
      }
    }
  }
  countdown() {
    if (!this.startScene) {
      const startTimer = this.time.addEvent({
        delay: 500,
        repeat: 1,
        callback: () => {
          if (startTimer.repeatCount === 1) {
            this.startScene = true;
          }
        }
      });
    }
  }
  keyboardInputs() {
    this.leftInput = this.input.keyboard.on('keyup_LEFT', this.onChange, this);
    this.rightInput = this.input.keyboard.on('keyup_RIGHT', this.onChange, this);
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.onSelect, this);
  }
  gamepadInputs() {
    // A button
    if (this.gamepad.A && this.buttonPressed === false) {
      this.buttonPressed = true;
      this.onSelect();
    }
    if (!this.gamepad.A) {
      this.buttonPressed = false;
    }
    // joystick
    if (this.gamepad.leftStick.x === -1 && this.stickPressed === false){
      this.stickPressed = true;
      this.onChange();
    } else if (this.gamepad.leftStick.x === 1 && this.stickPressed === false) {
      this.stickPressed = true;
      this.onChange();
    }
    if (this.gamepad.leftStick.x === 0) {
      this.stickPressed = false;
    }
  }
  createScene() {
    this.submitSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 2 - 280, this.height / 2 + 35, 200, 80)
    this.cancelSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 2, this.height / 2 + 35, 200, 80)
    this.submitSelectionBox.visible = false;

    this.submitButton = this.add.bitmapText(this.width / 2 - 250, this.height / 2 + 50, 'arcadeFont', 'Yes', 45).setTint(0xFFFFFF).setInteractive()
    this.cancelButton = this.add.bitmapText(this.width / 2 + 50, this.height / 2 + 50, 'arcadeFont', 'No', 45).setTint(0x000000).setInteractive()

    this.message1 = this.add.bitmapText(this.width / 2 - 520, this.height / 2 - 180, 'arcadeFont', 'Cancel submitting', 60);
    this.message2 = this.add.bitmapText(this.width / 2 - 360, this.height / 2 - 100, 'arcadeFont', 'your score?', 60);

    this.background = this.add.sprite(this.width / 2 + 5, this.height / 2, 'highscoreBG').setScale(11.5);
    this.eyes = this.add.sprite(this.width / 2 + 4, this.height / 2 - 110, 'highscoreEyes').setScale(9);
  }
  createAnimations() {
    this.eyes.play('blink');
    this.background.anims.playReverse('closeMouth');
  }
  onSelect() {
    if (this.selection === 'cancel') {
      this.startScene = false;
      this.background.play('closeMouth');
      this.background.on('animationcomplete', () => {
        this.scene.start('HighScore', { score: this.score });
      });
    } else {
      this.startScene = false;
      this.background.play('closeMouth');
      this.background.on('animationcomplete', () => {
        this.scene.start('Title');
      });
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