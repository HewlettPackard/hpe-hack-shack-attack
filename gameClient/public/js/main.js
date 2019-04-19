import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import HighScoreScene from './scenes/HighScoreScene.js';

let titleScene = new TitleScene();
let gameScene = new GameScene();
let highScoreScene = new HighScoreScene();

let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  pixelArt: true,
};

let game = new Phaser.Game(config);
game.scene.add('TitleScene', titleScene);
game.scene.add('GameScene', gameScene);
game.scene.add('HighScoreScene', highScoreScene);
game.scene.start('TitleScene');