export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1336,
  height: 768,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
};