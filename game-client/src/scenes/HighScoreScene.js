import 'phaser';

export default class HighScoreScene extends Phaser.Scene {
  constructor() {
    super('HighScore');
  }
  init(data) {
    this.height = this.game.config.height;
    this.width = this.game.config.width;
    
    this.chars = [
      [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
      [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
      [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', 'DEL', 'SUB']
    ];

    this.cursor = new Phaser.Math.Vector2();
    
    this.text;
    this.block;
    this.score = data.score;
    this.initials = '';
    this.name = '';
    this.initLimit = 3;
    this.nameLimit = 30;
  
    this.initialText;
    this.nameText;
  
    this.submitSuccess = false;
  }
  create() {
    this.text = this.add.bitmapText(this.width / 2 - 250, this.height / 2 - 180, 'arcadeFont', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-', 55)
      .setOrigin(0.5, 0.5)
      .setLetterSpacing(30)
      .setInteractive();
    
    this.add.image(this.text.x + 600, this.text.y + 110, 'rub').setScale(2);
    this.add.image(this.text.x + 705, this.text.y + 110, 'end').setScale(2);

    this.block = this.add.image(this.text.x / 2 - 40, this.text.y / 2 - 5, 'block');
    this.block.setScale(2.2);

    this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
    this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
    this.input.keyboard.on('keyup_UP', this.moveUp, this);
    this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
    this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
    this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
    this.input.keyboard.on('keyup', this.anyKey, this);

    this.text.on('pointermove', this.moveBlock, this);
    this.text.on('pointerup', this.pressKey, this);

    this.tweens.add({
        targets: this.block,
        alpha: 0.2,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        duration: 350
    });

    this.add.bitmapText(100, 400, 'arcadeFont', 'INITIALS', 35).setTint(0xFF1FDC83);
    this.add.bitmapText(100, 500, 'arcadeFont', 'NAME', 35).setTint(0xFF1FDC83);

    this.initialText = this.add.bitmapText(100, 440, 'arcadeFont', '', 30).setTint(0xFFFFFF);
    this.nameText = this.add.bitmapText(100, 540, 'arcadeFont', '', 30).setTint(0xFFFFFF);

    this.events.on('updateInitials', this.updateInitials, this);
    this.events.on('updateName', this.updateName, this);
    this.events.on('submitUserData', this.submitUserData, this);
  }
  update() {
    if (this.submitSuccess === true) {
      this.submitSuccess = false;
      this.initials = '';
      this.name = '';
      this.events.removeListener('submitUserData');
      this.events.removeListener('updateInitials');
      this.events.removeListener('updateName');
      this.scene.start('ThankYou');
    }
  }
  moveBlock (pointer, x, y){
    let cx = Phaser.Math.Snap.Floor(x, 106, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, 110, 0, true);
    let char = this.chars[cy][cx];

    this.cursor.set(cx, cy);

    this.block.x = this.text.x - 40 + (cx * 106);
    this.block.y = this.text.y - 5 + (cy * 110);
  }
  moveLeft () {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= 106;
    } else {
      this.cursor.x = 9;
      this.block.x += 106 * 9;
    }
  }
  moveRight () {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += 106;
    } else {
      this.cursor.x = 0;
      this.block.x -= 106 * 9;
    }
  }
  moveUp () {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= 110;
    } else {
      this.cursor.y = 2;
      this.block.y += 110 * 2;
    }
  }
  moveDown () {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += 110;
    } else {
      this.cursor.y = 0;
      this.block.y -= 110 * 2;
    }
  }
  anyKey (event){
    let code = event.keyCode;
    let initialLength = this.initials.length;
    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    } else if (initialLength > 0 && code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE) {
      this.cursor.set(8, 2);
      this.pressKey();
    } else if (code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z)
    {

      code -= 65;

      let y = Math.floor(code / 10);
      let x = code - (y * 10);

      this.cursor.set(x, y);
      this.pressKey();
    }
  }
  pressKey () {
    let x = this.cursor.x;
    let y = this.cursor.y;
    let initialLength = this.initials.length;
    let nameLength = this.name.length;

    this.block.x = this.text.x - 250 + (x * 106);
    this.block.y = this.text.y - 108 + (y * 110);
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
  submitUserData (initials, name, score) {
    const data = { initials, name, score };
    console.log('DATA', data);
      return fetch('http://localhost:3002/api/user/create', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json'
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.submitSuccess = true;
        }
      });
  }
  updateInitials (initials) {
    this.initialText.setText(initials);
  }
  updateName (name) {
    this.nameText.setText(name);
  }
}