import 'phaser';
import { API_URL } from '../config/config';

export default class HighScoreScene extends Phaser.Scene {
  constructor() {
    super('HighScore');
  }
  init(data = 300) {
    this.gamepad;
    this.animationTimer;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.startScene = false;

    this.chars = [
      [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
      [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
      [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', 'DEL', 'SUB']
    ];
    this.score = data.score;
    this.text;
    this.block;
    this.cursor = new Phaser.Math.Vector2();

    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.initials = '';
    this.name = '';
    this.initLimit = 3;
    this.nameLimit = 30;
    
    this.initialText;
    this.nameText;

    this.submitSuccess = false;
  }
  create() {
    this.countdown();
    this.createHighScoreMenu();
    this.addInputs();
    this.addEventListeners();
  }
  update(time) {
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
      this.enter();
    }
    if (this.gamepad.B && this.buttonPressed === false) {
      this.buttonPressed = true;
      this.backspace();
    }
    if (!this.gamepad.A && !this.gamepad.B) {
      this.buttonPressed = false;
    }
    // joystick
    if (this.gamepad.leftStick.y === -1 && this.stickPressed === false){
      this.stickPressed = true;
      this.moveUp();
    } else if (this.gamepad.leftStick.y === 1 && this.stickPressed === false) {
      this.stickPressed = true;
      this.moveDown();
    }
    if (this.gamepad.leftStick.x === -1 && this.stickPressed === false){
      this.stickPressed = true;
      this.moveLeft();
    } else if (this.gamepad.leftStick.x === 1 && this.stickPressed === false) {
      this.stickPressed = true;
      this.moveRight();
    }
    if (this.gamepad.leftStick.y === 0 && this.gamepad.leftStick.x === 0) {
      this.stickPressed = false;
    }
  }
  resetScene() {
    this.submitSuccess = '';
    this.initials = '';
    this.name = '';
    this.startScene = false;
    this.events.removeListener('updateInitials');
    this.events.removeListener('updateName');
    this.events.removeListener('submitUserData');
  }
  createHighScoreMenu() {
    this.text = this.add.bitmapText(this.width / 2 - 250, this.height / 2 - 80, 'arcadeFont', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-', 55)
    .setOrigin(0.5, 0.5)
    .setLetterSpacing(30)
    .setInteractive();
    
    this.add.image(this.text.x + 600, this.text.y + 110, 'rub').setScale(2);
    this.add.image(this.text.x + 705, this.text.y + 110, 'end').setScale(2);
    
    this.block = this.add.graphics()
    .fillStyle(0xFFFFFF, 1)
    .fillRect(this.text.x / 2 - 80, this.text.y / 2 + 80, 80, 12);
    this.add.bitmapText(100, 490, 'arcadeFont', 'INITIALS', 35).setTint(0xFF1FDC83);
    this.add.bitmapText(100, 590, 'arcadeFont', 'NAME', 35).setTint(0xFF1FDC83);
    
    this.initialText = this.add.bitmapText(100, 530, 'arcadeFont', '', 30).setTint(0xFFFFFF);
    this.nameText = this.add.bitmapText(100, 630, 'arcadeFont', '', 30).setTint(0xFFFFFF);
    
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
      repeat: 0
    });

    this.background = this.add.sprite(this.width / 2 + 4, this.height / 2, 'highscoreBG')
      .setScale(8)
      .play('blink');

    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 350
    });
  }
  addEventListeners() {
    this.events.on('updateInitials', this.updateInitials, this);
    this.events.on('updateName', this.updateName, this);
    this.events.on('submitUserData', this.submitUserData, this);
  }
  addInputs() {
    this.leftInput = this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
    this.rightInput = this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
    this.upInput = this.input.keyboard.on('keyup_UP', this.moveUp, this);
    this.downInput = this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
    this.deleteInput = this.input.keyboard.on('keyup_BACKSPACE', this.backspace, this);
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.enter, this);
  }
  moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= 106;
    } else {
      this.cursor.x = 9;
      this.block.x += 106 * 9;
    }
  }
  moveRight() {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += 106;
    } else {
      this.cursor.x = 0;
      this.block.x -= 106 * 9;
    }
  }
  moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= 110;
    } else {
      this.cursor.y = 2;
      this.block.y += 110 * 2;
    }
  }
  moveDown() {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += 110;
    } else {
      this.cursor.y = 0;
      this.block.y -= 110 * 2;
    }
  }
  updateInitials (initials) {
    this.initialText.setText(initials);
  }
  updateName (name) {
    this.nameText.setText(name);
  }
  submitUserData (initials, name, score) {
    const data = { initials, name, score };
      return fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.resetScene();
          this.background.play('closeMouth');
          this.background.on('animationcomplete', (animation, frame) =>{
            this.scene.start('ThankYou');
          });
        }
      })
      .catch(err => {
        this.resetScene();
        this.scene.start('ErrorModal', { score: this.score });
      });
  }
  backspace() {
    let initialLength = this.initials.length;
    let nameLength = this.name.length;
    
    if (initialLength > 0 && nameLength === 0 && initialLength !== 0) {
      this.initials = this.initials.substr(0, initialLength - 1);
      this.events.emit('updateInitials', this.initials);
    } else if (initialLength > 0 && nameLength > 0) {
      this.name = this.name.substr(0, nameLength - 1);
      this.events.emit('updateName', this.name);
    } else if (initialLength === 0) {
      this.resetScene();
      this.scene.start('BackToTitleModal', { score: this.score });
    }
  }
  enter() {
    let x = this.cursor.x;
    let y = this.cursor.y;
    let initialLength = this.initials.length;
    let nameLength = this.name.length;

    if (x === 9 && y === 2 && initialLength > 0 && nameLength > 0) {
      this.events.emit('submitUserData', this.initials, this.name, this.score);
    } else if (x === 8 && y === 2 && initialLength > 0 && nameLength === 0 && initialLength !== 0) {
      this.initials = this.initials.substr(0, initialLength - 1);
      this.events.emit('updateInitials', this.initials);
    } else if (x === 8 && y === 2 && initialLength > 0 && nameLength > 0) {

      this.name = this.name.substr(0, nameLength - 1);
      this.events.emit('updateName', this.name);
    } else if (initialLength < this.initLimit) {
      if (this.chars[y][x] !== 'DEL' && this.chars[y][x] !== 'SUB') {
        this.initials = this.initials.concat(this.chars[y][x]);
        this.events.emit('updateInitials', this.initials);
      }
    } else if (initialLength === this.initLimit && nameLength < this.nameLimit) {
      if (this.chars[y][x] !== 'DEL' && this.chars[y][x] !== 'SUB') {
        this.name = this.name.concat(this.chars[y][x]);
        this.events.emit('updateName', this.name);
      }
    }
  }
}