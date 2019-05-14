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
      debug: true,
      gravity: { y: 0 }
    }
  }
};

export const API_URL="http://localhost:3002/api/user/create";