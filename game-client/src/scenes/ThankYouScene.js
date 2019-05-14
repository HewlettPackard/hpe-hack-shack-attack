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
  createThankYou() {
    this.add.bitmapText(this.width / 2 + 10, this.height / 2 - 50, 'arcadeFont', 'THANKS FOR PLAYING!', 65).setTint(0xFFFFFF).setOrigin(0.5, 0.5)

    this.startText = this.add.bitmapText(this.width / 2, this.height - 350, 'arcadeFont', 'Press A to start over', 20).setTint(0xFFFFFFFF).setOrigin(0.5, 0.5);

    this.background = this.add.sprite(this.width / 2 + 4, this.height / 2, 'highscoreBG', [7])
      .setScale(8)
  }
  createAnimations() {
    this.startTextFade = this.tweens.add({
      targets: this.startText,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 1200,
    });
    
    this.blinkAnimation = this.anims.create({
      key: 'blink',
      frames: this.anims.generateFrameNumbers('highscoreBG', { start: 0, end: 2 }),
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

    this.background.play('blink');
    this.background.anims.playReverse('closeMouth');

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