class HighScoreScene extends Phaser.Scene {
  constructor() {
    super({ key: 'HighScoreScene' });

    this.chars = [
      [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ],
      [ 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ],
      [ 'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>' ]
  ];

  this.cursor = new Phaser.Math.Vector2();

  this.text;
  this.block;

  this.initials = '';
  this.name = '';
  this.initLimit = 3;
  this.nameLimit = 30;

  this.initialText;
  this.nameText;

  this.submitSuccess = false;
  }
  init(data) {
    this.score = data.score;
  }
  preload() {
    this.load.image('block', 'assets/input/block.png');
    this.load.image('rub', 'assets/input/rub.png');
    this.load.image('end', 'assets/input/end.png');

    this.load.bitmapFont('arcade', 'assets/fonts/bitmap/arcade.png', 'assets/fonts/bitmap/arcade.xml');
  }
  create() {
    let text = this.add.bitmapText(130, 50, 'arcade', 'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-', 20);

    text.setLetterSpacing(30);
    text.setInteractive();
    
    this.add.image(text.x + 320, text.y + 98, 'rub');
    this.add.image(text.x + 358, text.y + 98, 'end');

    this.block = this.add.image(text.x - 11, text.y - 7, 'block').setOrigin(0);
    this.block.setScale(0.9);

    this.text = text;

    this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
    this.input.keyboard.on('keyup_RIGHT', this.moveRight, this);
    this.input.keyboard.on('keyup_UP', this.moveUp, this);
    this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
    this.input.keyboard.on('keyup_ENTER', this.pressKey, this);
    this.input.keyboard.on('keyup_SPACE', this.pressKey, this);
    this.input.keyboard.on('keyup', this.anyKey, this);

    text.on('pointermove', this.moveBlock, this);
    text.on('pointerup', this.pressKey, this);

    this.tweens.add({
        targets: this.block,
        alpha: 0.2,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        duration: 350
    });

    this.add.bitmapText(100, 180, 'arcade', 'INITIALS', 15).setTint(0xFF1FDC83);
    this.add.bitmapText(100, 220, 'arcade', 'NAME', 15).setTint(0xFF1FDC83);

    this.add.bitmapText(300, 300, 'arcade', `${this.score}`, 30).setTint(0xff00ff);

    this.initialText = this.add.bitmapText(100, 200, 'arcade', '', 15).setTint(0xFFFFFF);
    this.nameText = this.add.bitmapText(100, 240, 'arcade', '', 15).setTint(0xFFFFFF);

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
      this.scene.start('TitleScene');
    }
  }
  moveBlock (pointer, x, y){
    let cx = Phaser.Math.Snap.Floor(x, 38.5, 0, true);
    let cy = Phaser.Math.Snap.Floor(y, 40, 0, true);
    let char = this.chars[cy][cx];

    this.cursor.set(cx, cy);

    this.block.x = this.text.x - 11 + (cx * 38.5);
    this.block.y = this.text.y - 7 + (cy * 40);
  }

  moveLeft () {
    if (this.cursor.x > 0) {
      this.cursor.x--;
      this.block.x -= 38.5;
    } else {
      this.cursor.x = 9;
      this.block.x += 38.5 * 9;
    }
  }

  moveRight () {
    if (this.cursor.x < 9) {
      this.cursor.x++;
      this.block.x += 38.5;
    } else {
      this.cursor.x = 0;
      this.block.x -= 38.5 * 9;
    }
  }

  moveUp () {
    if (this.cursor.y > 0) {
      this.cursor.y--;
      this.block.y -= 40;
    } else {
      this.cursor.y = 2;
      this.block.y += 40 * 2;
    }
  }

  moveDown () {
    if (this.cursor.y < 2) {
      this.cursor.y++;
      this.block.y += 40;
    } else {
      this.cursor.y = 0;
      this.block.y -= 40 * 2;
    }
  }

  anyKey (event){
    let code = event.keyCode;

    if (code === Phaser.Input.Keyboard.KeyCodes.PERIOD) {
      this.cursor.set(6, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.MINUS) {
      this.cursor.set(7, 2);
      this.pressKey();
    } else if (code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE) {
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

    this.block.x = this.text.x - 11 + (x * 38.5);
    this.block.y = this.text.y - 7 + (y * 40);

    if (x === 9 && y === 2 && initialLength > 0 && nameLength > 0) {
      this.events.emit('submitUserData', this.initials, this.name, this.score);
    } else if (x === 8 && y === 2 && initialLength > 0 && nameLength === 0) {
      this.initials = this.initials.substr(0, initialLength - 1);
      this.events.emit('updateInitials', this.initials);
    } else if (x === 8 && y === 2 && initialLength > 0 && nameLength > 0) {
      this.name = this.name.substr(0, nameLength - 1);
      this.events.emit('updateName', this.name);
    } else if (initialLength < this.initLimit) {
      this.initials = this.initials.concat(this.chars[y][x]);
      this.events.emit('updateInitials', this.initials);
    } else if (initialLength === this.initLimit && nameLength < this.nameLimit) {
      this.name = this.name.concat(this.chars[y][x]);
      this.events.emit('updateName', this.name);
    }
  }
  submitUserData (initials, name, score) {
    const data = { initials, name, score };
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

export default HighScoreScene;