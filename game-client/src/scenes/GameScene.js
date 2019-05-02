import 'phaser';
import ItBug from '../objects/ItBug';
import ItMonster from '../objects/ItMonster';
import Player from '../objects/Player';
import Bullet from '../objects/Bullet';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  init() {
    this.spawnTimerBug = 0;
    this.spawnTimerMonster = 0;
    this.bulletTimer = 0;
    this.collisionDamage = 1
    this.spawnSide = ['left', 'right', 'bottom'];

    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.score = 0;
    this.startRound = false;
  }
  create() {
    this.map = this.add.sprite(this.width / 2, this.height / 2, 'map');

    this.fireKeys = this.input.keyboard.createCursorKeys();
    this.moveKeys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D
    });

    this.startText = this.add.bitmapText(this.width / 2, this.height / 2 - 200, 'arcadeFont', '', 75)
    .setTint(0xFFFFFF)
    .setOrigin(0.5, 0.5);


    this.countdown();
    this.createWallsandBorders();
    this.createGroups();
    this.createPlayer();
    this.addCollisions();
    this.setupEvents();
    this.physics.world.setBounds(0, 120, this.width, this.height - 100);
    this.playerAvatar = this.add.sprite(1115, 32, 'playerAvatar')
      .setScale(0.5)
      .setDepth(1);
    this.scoreText = this.add.bitmapText(20, 20, 'arcadeFont', 'Score:0', 25)
      .setTint(0xFFFFFF)
      .setDepth(1);
    this.livesText = this.add.bitmapText(1140, 20, 'arcadeFont', `Lives:${this.player.lives}`, 25)
      .setTint(0xFFFFFF)
      .setDepth(1);

  }
  setupEvents() {
    this.events.on('gameover', () => {
      this.events.removeListener('gameover');
      this.events.removeListener('updateScore');
      this.scene.start('GameOver', { score: this.score })
    })
    this.events.on('updateScore', () => {
      this.score++;
      this.scoreText.setText(`Score:${this.score}`);
    })
  }
  createWallsandBorders() {
    this.doorLeft = this.physics.add.sprite(this.width / 2 - 70 , -180)
    this.physics.add.existing(this.doorLeft);
    this.doorLeft.body
      .setSize(10, 600)
      .setImmovable(true);

    this.doorRight = this.physics.add.sprite(this.width / 2 + 60 , -180)
    this.physics.add.existing(this.doorRight);
    this.doorRight.body
      .setSize(10, 600)
      .setImmovable(true);

    this.borderDark = this.add.graphics()
      .fillStyle(0x000000, 1)
      .fillRect(0, this.height / 2 - 265, 50, this.height - 169)
      .fillRect(this.width - 50, this.height / 2 - 265, 50, this.height - 169)
      .fillRect(this.width / 2 - 82, 0, 150, 50)
      .fillRect(0, this.height - 50, this.width, 50)
      .setDepth(2);

    this.borderLight = this.add.graphics()
      .fillStyle(0x000000, 0.5)
      .fillRect(0, this.height / 2 - 265, 75, this.height - 194)
      .fillRect(this.width - 75, this.height / 2 - 265, 75, this.height - 194)
      .fillRect(this.width / 2 - 82, 0, 150, 75)
      .fillRect(0, this.height - 75, this.width, 75)
      .setDepth(1);
  }
  createGroups() {
    this.itBugs = this.physics.add.group({ classType: ItBug, runChildUpdate: true });
    this.itMonsters = this.physics.add.group({ classType: ItMonster, runChildUpdate: true });
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  }
  addCollisions() {
    this.physics.add.collider(this.itBugs, this.itBugs);
    this.physics.add.collider(this.itMonsters, this.itMonsters);
    this.physics.add.collider(this.itMonsters, this.itBugs);

    this.physics.add.collider(this.itMonsters, this.doorLeft);
    this.physics.add.collider(this.itMonsters, this.doorRight);

    this.physics.add.overlap(this.player, this.itBugs, () => this.player.onHit(this.collisionDamage, this.livesText), this.checkEnemyCollision, this);
    this.physics.add.overlap(this.itBugs, this.bullets, this.bulletCollision, this.checkBulletCollision, this);

    this.physics.add.overlap(this.player, this.itMonsters, () => this.player.onHit(this.collisionDamage, this.livesText), this.checkEnemyCollision, this);
    this.physics.add.overlap(this.itMonsters, this.bullets, this.bulletCollision, this.checkBulletCollision, this);
  }
  createPlayer() {
    this.player = new Player(this, this.width / 2 - 5, this.height / 2);
    this.player.setCollideWorldBounds(true)
      .setSize(70, 95, true);
  }
  update(time) {
    if (this.startRound) {
      this.player.update(this.moveKeys, this.fireKeys);
      this.fireBullets(time, this.fireKeys);
      this.spawnitBug(time);
      this.spawnitMonster(time);

      Phaser.Utils.Array.Each(
        this.itBugs.getChildren(),
        this.physics.moveToObject,
        this.physics,
        this.player, 150);

      Phaser.Utils.Array.Each(
        this.itMonsters.getChildren(),
        this.physics.moveToObject,
        this.physics,
        this.player, 150);
    } else {
      this.spawnTimerBug = time;
      this.bulletTimer = time;
    }
  }
  countdown() {
    if (!this.startRound) {
      const startTimer = this.time.addEvent({
        delay: 1000,
        repeat: 4,
        callback: () => {
          this.startText.setText(`${startTimer.repeatCount - 1}`);
          if (startTimer.repeatCount === 1) {
            this.startText.setText(`GO!`)
              .setX(this.width / 2 + 20);
            this.startRound = true;
          }
          if (startTimer.repeatCount === 0) {
            this.startText.setAlpha(0);
          }
        }
      });
    }
  }
  fireBullets(time, key) {
    if (time > this.bulletTimer) {
      if (key.up.isDown || key.down.isDown || key.right.isDown || key.left.isDown) {
        let bullet = this.bullets.getFirstDead(false);
        if (!bullet) {
          bullet = new Bullet(this, 0, 0);
          this.bullets.add(bullet);
        }
        if (bullet) {
          bullet.onFire(this.player.x, this.player.y, key);
          this.bulletTimer += 150;
        }
      } else {
        this.bulletTimer += 250;
      }     
    }
  }
  spawnitBug(time) {
    if (time > this.spawnTimerBug) {
      let itBug = this.itBugs.getFirstDead(false);
      if (!itBug) {
        itBug = new ItBug(this, 0, 0);
        this.itBugs.add(itBug);
      }
      if (itBug) {
        let coords = this.getSpawnPos();
        itBug.setActive(true)
          .setVisible(true)
          .setScale(0.6)
          .setCircle(34, 15, 18)
          .spawn(coords.x, coords.y);
        let newTime = Phaser.Math.Between(500, 1500);
        this.spawnTimerBug = time + newTime;
      }
    }
  }
  spawnitMonster(time) {
    if (time > this.spawnTimerMonster) {
      let itMonster = this.itMonsters.getFirstDead(false);
      if (!itMonster) {
        itMonster = new ItMonster(this, 0, 0);
        this.itMonsters.add(itMonster);
      }
      if (itMonster) {
        itMonster.setActive(true)
          .setVisible(true)
          .setScale(0.6)
          .spawn(this.width / 2, 0);
        let newTime = Phaser.Math.Between(1500, 3000);
        this.spawnTimerMonster = time + newTime;
      }
    }
  }
  getSpawnPos() {
    let index = Math.floor(Math.random() * 3);
    let x;
    let y;
    switch(this.spawnSide[index]){
      case('left'):
        x = Phaser.Math.Between(-15, -45);
        y = Phaser.Math.Between(100, this.height);
        return { x, y };
      case('right'):
        x = Phaser.Math.Between(this.width + 15, this.width + 45);
        y = Phaser.Math.Between(100, this.height);
        return { x, y };
      case('bottom'):
        x = Phaser.Math.Between(0, this.width);
        y = Phaser.Math.Between(this.height + 15, this.height + 45);
        return { x, y };
    }
  }
  checkBulletCollision(bullet, enemy) {
    return (bullet.active && enemy.active);
  }
  checkEnemyCollision(player, enemy) {
    return (player.active && enemy.active);
  }
  bulletCollision(enemy, bullet) {
    enemy.onHit(1);
    bullet.onHit();
  }
}
