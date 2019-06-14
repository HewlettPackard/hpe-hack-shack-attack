/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import 'phaser';

export default class SplashScene extends Phaser.Scene {
  constructor() {
    super('Splash');
  }
  init() {
    this.startScene = false;
    this.buttonPressed = false;
    this.gamepad;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
  }
  create() {
    this.countdown();
    this.keyboardInputs();
    this.winnersSplash = this.add.sprite(this.width / 2, this.height / 2, 'winners')
    this.cameras.main.fadeIn(2000);
    this.time.addEvent({
      delay: 7000,
      callback: () => {
        this.cameras.main.fade(2000);
        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.scene.start('AttractMode')
        });
      }
    });
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
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.onEnter, this);
  }
  onEnter() {
    this.startScene = false;
    this.scene.start('Title');
  }
  gamepadInputs() {
    if (this.gamepad.A && this.buttonPressed === false) {
      this.buttonPressed = true;
      this.onEnter();
    }
    if (!this.gamepad.A) {
      this.buttonPressed = false;
    }
  }
}