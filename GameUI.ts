import Phaser from 'phaser';
import { GAME_TITLE, VIEW } from '../config/constants';

/** UI cố định trên màn hình (scrollFactor 0). */
export class GameUI {
  private hpBar: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    const font = 'Georgia, serif';
    const fix = (o: Phaser.GameObjects.GameObject) => {
      (o as Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.ScrollFactor & Phaser.GameObjects.Components.Depth)
        .setScrollFactor(0)
        .setDepth(1000);
    };

    fix(scene.add.text(VIEW.width / 2, 12, GAME_TITLE, { fontFamily: font, fontSize: '20px', color: '#bfefff' }).setOrigin(0.5, 0));
    fix(scene.add.text(16, 14, 'HP', { fontFamily: font, fontSize: '16px', color: '#ffb4a8' }));
    fix(
      scene.add.text(16, 48, 'WASD / Arrows - Move\nJ / Mouse1 - Attack\nSpace - Dodge\nK / Mouse2 - Parry', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#9aa7b8',
        lineSpacing: 4,
      }),
    );
    this.hpBar = scene.add.graphics();
    fix(this.hpBar);
  }

  setHp(hp: number, maxHp: number): void {
    const w = 200;
    this.hpBar.clear();
    this.hpBar.fillStyle(0x1a1d26, 1).fillRect(44, 16, w, 16);
    this.hpBar.fillStyle(0xc0392b, 1).fillRect(44, 16, (w * Math.max(0, hp)) / maxHp, 16);
    this.hpBar.lineStyle(2, 0x6b7a90, 1).strokeRect(44, 16, w, 16);
  }
}
