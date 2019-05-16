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
    this.leftInput = this.input.keyboard.on('keyup_LEFT', this.onChange, this);
    this.rightInput = this.input.keyboard.on('keyup_RIGHT', this.onChange, this);
    this.select = this.input.keyboard.on('keyup_ENTER', this.onSelect, this);
  }
  update() {
    if (this.input.gamepad.total === 0 ) {
      return;
    }
    this.gamepad = this.input.gamepad.getPad(0);
    if (this.startScene) {
      this.gamepadInputs();
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
      .fillRoundedRect(this.width / 2 - 230, this.height / 2 + 95, 200, 65);
    this.submitSelectionBox.visible = false;
    this.cancelSelectionBox = this.add.graphics()
      .fillStyle(0xFFFFFF, 1)
      .fillRoundedRect(this.width / 2 + 50, this.height / 2 + 95, 200, 65);
    this.message1 = this.add.bitmapText(this.width / 2 - 420, this.height / 2 - 120, 'arcadeFont', 'Cancel submitting', 50);
    this.message2 = this.add.bitmapText(this.width / 2 - 260, this.height / 2 - 40, 'arcadeFont', 'your score?', 50);
    this.submitButton = this.add.bitmapText(this.width / 2 - 200, this.height / 2 + 100, 'arcadeFont', 'Yes', 45).setTint(0xFFFFFF);
    this.cancelButton = this.add.bitmapText(this.width / 2 + 100, this.height / 2 + 100, 'arcadeFont', 'No', 45).setTint(0x000000);

    this.background = this.add.sprite(this.width / 2 + 4, this.height / 2, 'highscoreBG').setScale(8);
    this.eyes = this.add.sprite(this.width / 2 + 4, this.height / 2, 'highscoreEyes').setScale(8);
  }
  createAnimations() {
    this.blinkAnimation = this.anims.create({
      key: 'blink',
      frames: this.anims.generateFrameNumbers('highscoreEyes', { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1,
      delay: 5000,
      repeatDelay: 6000
    });
    this.closeMouthAnimation = this.anims.create({
      key: 'closeMouth',
      frames: this.anims.generateFrameNumbers('highscoreBG', { start: 3, end: 7 }),
      frameRate: 30,
      delay: 500,
      repeat: 0
    });
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