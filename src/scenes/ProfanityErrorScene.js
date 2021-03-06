/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import 'phaser';

export default class ProfanityErrorScene extends Phaser.Scene {
  constructor() {
    super('ProfanityError');
  }
  init(data) {
    this.gamepad;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.startScene = false;

    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.score = data.score;
  }
  create() {
    this.countdown();
    this.createScene();
    this.createAnimations();
    this.keyboardInputs();
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.enter, this);
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
  keyboardInputs() {
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.enter, this);
  }
  gamepadInputs() {
    // A button
    if (this.gamepad.A && this.buttonPressed === false) {
      this.buttonPressed = true;
      this.enter();
    }
    if (!this.gamepad.A) {
      this.buttonPressed = false;
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
  createScene() {
    this.message1 = this.add.bitmapText(this.width / 2 - 720, this.height / 2 - 180, 'arcadeFont', 'Profanity is not allowed', 60);
    this.message2 = this.add.bitmapText(this.width / 2 - 780, this.height / 2 - 100, 'arcadeFont', 'in either initials or name', 60);
    this.message4 = this.add.bitmapText(this.width - 200, this.height / 2 - 75, 'arcadeFont', '.', 60);
    this.acceptText = this.add.bitmapText(this.width / 2 - 490, this.height / 2 + 80, 'arcadeFont', 'Press A or Enter to continue', 35)
      .setTint(0xFFFFFF)

    this.background = this.add.sprite(this.width / 2 + 5, this.height / 2, 'highscoreBG').setScale(11.5);
    this.eyes = this.add.sprite(this.width / 2 + 4, this.height / 2 - 110, 'highscoreEyes').setScale(9);
  }
  createAnimations() {
    this.tweens.add({
      targets: this.acceptText,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 800,
    });
    this.eyes.play('blink');
    this.background.anims.playReverse('closeMouth');
  }
  enter() {
    this.startScene = false;
    this.background.play('closeMouth');
    this.background.on('animationcomplete', () => {
      this.scene.start('HighScore', { score: this.score });
    });
  }
}