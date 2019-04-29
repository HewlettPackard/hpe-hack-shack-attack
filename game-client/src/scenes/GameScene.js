import 'phaser';
import Enemy from '../objects/Enemy';
import Player from '../objects/Player';
import Bullet from '../objects/Bullet';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }
  init() {
    this.spawnTimer = 0;
    this.bulletTimer = 0;
    this.collisionDamage = 1
    this.spawnSide = ['top', 'left', 'right', 'bottom'];

    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.score = 0;
    this.startRound = false;
  }
  create() {
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
    this.createGroups();
    this.createPlayer();
    this.addCollisions();
    this.setupEvents();
    this.physics.world.setBounds(0, 0, 1336, 768);
    this.scoreText = this.add.bitmapText(20, 20, 'arcadeFont', 'Score:0', 25).setTint(0xFFFFFF);
    this.livesText = this.add.bitmapText(1140, 20, 'arcadeFont', `Lives:${this.player.lives}`, 25).setTint(0xFFFFFF);
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
  createGroups() {
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
  }
  addCollisions() {
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.overlap(this.player, this.enemies, () => this.player.onHit(this.collisionDamage, this.livesText), this.checkEnemyCollision, this);
    this.physics.add.overlap(this.enemies, this.bullets, this.bulletCollision, this.checkBulletCollision, this);
  }
  createPlayer() {
    this.player = new Player(this, this.width / 2 - 5, this.height / 2);
    this.player.setCollideWorldBounds(true)
      .setSize(16, 16);
  }
  update(time) {
    if (this.startRound) {
      this.player.update(this.moveKeys, this.fireKeys);
      this.fireBullets(time);
      this.spawnEnemies(time);
      Phaser.Utils.Array.Each(
        this.enemies.getChildren(),
        this.physics.moveToObject,
        this.physics,
        this.player, 150);
    } else {
      this.spawnTimer = time;
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
  fireBullets(time) {
    if (time > this.bulletTimer) {
      let bullet = this.bullets.getFirstDead(false);
      if (!bullet) {
        bullet = new Bullet(this, 0, 0);
        this.bullets.add(bullet);
      }
      if (bullet) {
        bullet.onFire(this.player.x, this.player.y, this.fireKeys);
        this.bulletTimer += 250;
      }
    }
  }
  spawnEnemies(time) {
    if (time > this.spawnTimer) {
      let enemy = this.enemies.getFirstDead(false);
      if (!enemy) {
        enemy = new Enemy(this, 0, 0);
        this.enemies.add(enemy);
      }
      if (enemy) {
        let coords = this.getSpawnPos();
        enemy.setActive(true)
          .setVisible(true)
          .setScale(0.35)
          .spawn(coords.x, coords.y);
        let newTime = Phaser.Math.Between(500, 1500);
        this.spawnTimer = time + newTime;
      }
    }
  }
  getSpawnPos() {
    let index = Math.floor(Math.random() * 4);
    let x;
    let y;
    switch(this.spawnSide[index]){
      case('top'):
        x = Phaser.Math.Between(0, this.width);
        y = Phaser.Math.Between(-15, -45);
        return { x, y };
      case('left'):
        x = Phaser.Math.Between(-15, -45);
        y = Phaser.Math.Between(0, this.height);
        return { x, y };
      case('right'):
        x = Phaser.Math.Between(this.width + 15, this.width + 45);
        y = Phaser.Math.Between(0, this.height);
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
