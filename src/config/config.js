export const config = {
  type: Phaser.AUTO,
  parent: "phaser-game",
  width: 1920,
  height: 1080,
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
export const API_URL="https://lv19.hpedev.io/.netlify/functions/api/user/create";