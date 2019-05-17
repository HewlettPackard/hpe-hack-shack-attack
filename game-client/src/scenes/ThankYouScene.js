import 'phaser';

export default class ThankYouScene extends Phaser.Scene {
  constructor() {
    super('ThankYou')
  }
  init() {
    this.gamepad;
    this.buttonPressed = false;
    this.startScene;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
  }
  create() {
    this.createThankYou();
    this.createAnimations();
    this.countdown();
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
  createThankYou() {
    this.add.bitmapText(this.width / 2 + 10, this.height / 2 - 150, 'arcadeFont', 'THANKS FOR PLAYING!', 75).setTint(0xFFFFFF).setOrigin(0.5, 0.5)

    this.acceptText = this.add.bitmapText(this.width / 2 - 490, this.height / 2 - 20, 'arcadeFont', 'Press A or Enter to continue', 35)
      .setTint(0xFFFFFF)

    this.background = this.add.sprite(this.width / 2 + 5, this.height / 2, 'highscoreBG').setScale(11.5);
    this.eyes = this.add.sprite(this.width / 2 + 4, this.height / 2 - 110, 'highscoreEyes').setScale(9);
  }
  createAnimations() {
    this.acceptTextFade = this.tweens.add({
      targets: this.acceptText,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 1200,
    });
    
    this.eyes.play('blink');
    this.background.anims.playReverse('closeMouth');
  }
  keyboardInputs() {
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.enter, this);
  }
  gamepadInputs() {
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
  enter() {
    this.startScene = false;
    this.background.play('closeMouth');
    this.background.on('animationcomplete', (animation, frame) => {
      this.scene.start('Title');
    });
  }
}