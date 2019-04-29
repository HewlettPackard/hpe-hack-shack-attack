import 'phaser';

import blockImg from '../assets/input/block.png';
import rubImg from '../assets/input/rub.png';
import endImg from '../assets/input/end.png';
import pixelImg from '../assets/sprites/16x16.png'
import ghostImg from '../assets/sprites/ghost.png'
import arcadeFontImg from '../assets/fonts/arcade.png'
import arcadeFontXml from '../assets/fonts/arcade.xml'

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
    // input panel
    this.load.image('block', blockImg);
    this.load.image('rub', rubImg);
    this.load.image('end', endImg);
    // sprites
    this.load.image('pixel', pixelImg);
    this.load.image('ghost', ghostImg);
    // font
    this.load.bitmapFont('arcadeFont', arcadeFontImg, arcadeFontXml);
  }
  ready() {
    this.readyCount++;
    if(this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}
