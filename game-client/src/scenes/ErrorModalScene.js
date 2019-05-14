import 'phaser';

export default class ErrorModalScene extends Phaser.Scene {
  constructor() {
    super('ErrorModal');
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
    this.createModal();
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
  enter() {
    this.startScene = false;
    this.scene.start('Title');
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
    this.message1 = this.add.bitmapText(this.width / 2 - 180, this.height / 2 - 180, 'arcadeFont', 'There was an error', 20);
    this.message2 = this.add.bitmapText(this.width / 2 - 180, this.height / 2 - 140, 'arcadeFont', 'submitting your', 20);
    this.message3 = this.add.bitmapText(this.width / 2 - 180, this.height / 2 - 100, 'arcadeFont', 'score', 20);
    this.message4 = this.add.bitmapText(this.width / 2 - 82, this.height / 2 - 94, 'arcadeFont', '.', 20);
    this.acceptButton = this.add.bitmapText(this.width / 2 - 20, this.height / 2 - 45, 'arcadeFont', 'OK', 25)
      .setTint(0xFFFFFF)
    this.tweens.add({
        targets: this.acceptButton,
        alpha: 0,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        duration: 800,
      });
  }
}

