import Phaser from "phaser";
import { config } from './config/config';
import BootScene from './scenes/BootScene';
import PreloaderScene from './scenes/PreloaderScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';
import HighScoreScene from './scenes/HighScoreScene';
import ErrorModalScene from './scenes/ErrorModalScene';
import BackToTitleModalScene from './scenes/BackToTitleModalScene';
import ThankYouScene from './scenes/ThankYouScene';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Game', GameScene);
    this.scene.add('GameOver', GameOverScene);
    this.scene.add('HighScore', HighScoreScene);
    this.scene.add('BackToTitleModal', BackToTitleModalScene);
    this.scene.add('ErrorModal', ErrorModalScene);
    this.scene.add('ThankYou', ThankYouScene);
    this.scene.start('Boot');
  }
}

window.onload = function () {
  window.game = new Game();
}