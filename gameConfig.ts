import Phaser from 'phaser';
import { VIEW } from './constants';
import { GameScene } from '../scenes/GameScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: VIEW.width,
  height: VIEW.height,
  backgroundColor: '#07080c',
  physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [GameScene],
};
