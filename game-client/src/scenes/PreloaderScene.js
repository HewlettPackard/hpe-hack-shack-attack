import 'phaser';
// placeholder assets
import blockImg from '../assets/input/block.png';
import rubImg from '../assets/input/rub.png';
import endImg from '../assets/input/end.png';
import pixelImg from '../assets/sprites/16x16.png'
import ghostImg from '../assets/sprites/ghost.png'
import arcadeFontImg from '../assets/fonts/arcade.png'
import arcadeFontXml from '../assets/fonts/arcade.xml'
// tiles
import floorTile1 from '../assets/tiles/floor-tile-1.png';
import floorTile2 from '../assets/tiles/floor-tile-2.png';
import floorTile3 from '../assets/tiles/floor-tile-3.png';
import floorTile4 from '../assets/tiles/floor-tile-4.png';
import map from '../assets/sprites/playfield.png';
// sprites
// logos
import gameLogo from '../assets/sprites/attack-marquee.png';
import hpeDevLogo from '../assets/sprites/hpe-dev-logo.png';
import hpeLogo from '../assets/sprites/dev-powerup.png';
// game
import playerAvatar from '../assets/sprites/player1-avatar.png';
import player from '../assets/sprites/player1-dev.png';
import bullet from '../assets/sprites/bullets-pellets.png';
import itBug from '../assets/sprites/it-bug.png';
import itMonster from '../assets/sprites/it-monster.png';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader'); 
  }
  init() {
    this.readyCount = 0;
  }
  preload() {    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50)
    // loading text
    const loadingText = this.make.text({
      x : width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#FFFFFF'
      }
    });
    // set anchor to center
    loadingText.setOrigin(0.5, 0.5);
    // percent text
    const percentText = this.make.text({
      x : width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#FFFFFF'
      }
    });
    // set anchor to center
    percentText.setOrigin(0.5, 0.5);
    // loading assets text
    const assetsText = this.make.text({
      x : width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#FFFFFF'
      }
    });
    // set anchor to center
    assetsText.setOrigin(0.5, 0.5);
    // update progress bar and file progress bar
    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xFFFFFF, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30)
    });
    this.load.on('fileprogress', (file) => {
      assetsText.setText(`Loading asset: ${file.key}`);
    })
    // remove progress bars when complete
    this.load.on('complete', () => {
      progressBox.destroy();
      progressBar.destroy();
      assetsText.destroy();
      loadingText.destroy();
      percentText.destroy();
      this.ready();
    });
    // timed event for logo
    this.timedEvent = this.time.delayedCall(1, this.ready, [], this);
    // placeholder sprites
    // input panel
    this.load.image('block', blockImg);
    this.load.image('rub', rubImg);
    this.load.image('end', endImg);
    // sprites
    this.load.image('pixel', pixelImg);
    this.load.image('ghost', ghostImg);
    // font
    this.load.bitmapFont('arcadeFont', arcadeFontImg, arcadeFontXml);

    //sprites
    this.load.image('floorTile1', floorTile1);
    this.load.image('floorTile2', floorTile2);
    this.load.image('floorTile3', floorTile3);
    this.load.image('floorTile4', floorTile4);
    this.load.image('map', map);
    
    this.load.image('gameLogo', gameLogo);
    this.load.image('hpeDevLogo', hpeDevLogo);
    this.load.image('hpeLogo', hpeLogo);

    this.load.image('playerAvatar', playerAvatar);
    this.load.image('player', player);
    this.load.image('bullet', bullet);
    this.load.image('itBug', itBug);
    this.load.image('itMonster', itMonster);
  }
  ready() {
    this.readyCount++;
    if(this.readyCount === 2) {
      this.scene.start('Game');
    }
  }
}
