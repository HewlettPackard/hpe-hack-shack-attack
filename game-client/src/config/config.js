export const config = {
  type: Phaser.AUTO,
  parent: "phaser-game",
  width: 1336,
  height: 768,
  input: {
    gamepad: true,
    queue: true
  },
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  }
};
//1920 1080
export const API_URL="http://localhost:3002/api/user/create";