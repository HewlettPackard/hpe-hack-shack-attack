/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }
  create() {
    this.scene.start('Preloader');
  }
}
