import 'phaser';
import { API_URL } from '../config/config';

export default class HighScoreScene extends Phaser.Scene {
  constructor() {
    super('HighScore');
  }
  init(data = 300) {
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
    this.createHighScoreMenu();
    this.addInputs();
    this.addEventListeners();
  }
  update() {
  }
  resetScene() {
    this.submitSuccess = '';
    this.initials = '';
    this.name = '';
    this.events.removeListener('updateInitials');
    this.events.removeListener('updateName');
  }
  createHighScoreMenu() {
    this.text = this.add.bitmapText(this.width / 2 - 250, this.height / 2 - 180, 'arcadeFont', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-', 55)
      .setOrigin(0.5, 0.5)
      .setLetterSpacing(30)
      .setInteractive();
    
    this.add.image(this.text.x + 600, this.text.y + 110, 'rub').setScale(2);
    this.add.image(this.text.x + 705, this.text.y + 110, 'end').setScale(2);

    this.block = this.add.image(this.text.x / 2 - 40, this.text.y / 2 - 5, 'block');
    this.block.setScale(2.2);

    this.add.bitmapText(100, 400, 'arcadeFont', 'INITIALS', 35).setTint(0xFF1FDC83);
    this.add.bitmapText(100, 500, 'arcadeFont', 'NAME', 35).setTint(0xFF1FDC83);

    this.initialText = this.add.bitmapText(100, 440, 'arcadeFont', '', 30).setTint(0xFFFFFF);
    this.nameText = this.add.bitmapText(100, 540, 'arcadeFont', '', 30).setTint(0xFFFFFF);

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
          this.scene.start('ThankYou');
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
      console.log('delete name');
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