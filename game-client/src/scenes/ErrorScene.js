import 'phaser';

export default class ErrorScene extends Phaser.Scene {
  constructor() {
    super('Error');
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
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.enter, this);
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
    this.message1 = this.add.bitmapText(this.width / 2 - 580, this.height / 2 - 50, 'arcadeFont', 'There was an error when', 50);
    this.message2 = this.add.bitmapText(this.width / 2 - 530, this.height / 2 + 20, 'arcadeFont', 'submitting your score', 50);
    this.message4 = this.add.bitmapText(this.width / 2 + 500, this.height / 2 + 38, 'arcadeFont', '.', 50);
    this.acceptButton = this.add.bitmapText(this.width / 2 - 50, this.height / 2 + 150, 'arcadeFont', 'OK', 45)
      .setTint(0xFFFFFF)

    this.background = this.add.sprite(this.width / 2 + 4, this.height / 2, 'highscoreBG').setScale(8);
    this.eyes = this.add.sprite(this.width / 2 + 4, this.height / 2, 'highscoreEyes').setScale(8);
  }
  createAnimations() {
    this.tweens.add({
      targets: this.acceptButton,
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
      this.scene.start('Title');
    });
  }
}

