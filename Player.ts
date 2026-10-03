import Phaser from 'phaser';
import { PLAYER, FEEDBACK_MS } from '../config/constants';

export class Player extends Phaser.Physics.Arcade.Sprite {
  hp = PLAYER.maxHp;
  readonly maxHp = PLAYER.maxHp;
  readonly facing = new Phaser.Math.Vector2(1, 0);

  private shadow: Phaser.GameObjects.Ellipse;
  private aura: Phaser.GameObjects.Ellipse;
  private feedback: Phaser.GameObjects.Text;
  private feedbackTimer?: Phaser.Time.TimerEvent;
  private trail: Phaser.GameObjects.Particles.ParticleEmitter;

  /** Gọi 1 lần trước khi tạo Player: vẽ placeholder bằng Graphics. */
  static createTextures(scene: Phaser.Scene): void {
    if (scene.textures.exists('player')) return;
    const g = scene.make.graphics({}, false);
    g.fillStyle(0x2c3e5c, 1).fillCircle(20, 20, PLAYER.radius);
    g.lineStyle(2, 0x9fe8ff, 1).strokeCircle(20, 20, PLAYER.radius);
    g.fillStyle(0x9fe8ff, 1).fillTriangle(30, 12, 39, 20, 30, 28); // mũi tên hướng nhìn
    g.generateTexture('player', 40, 40);
    g.clear();
    g.fillStyle(0x9fe8ff, 1).fillCircle(3, 3, 3);
    g.generateTexture('spark', 6, 6);
    g.destroy();
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(5).setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setCircle(PLAYER.radius, 4, 4);

    this.shadow = scene.add.ellipse(x, y + 14, 34, 14, 0x000000, 0.4).setDepth(1);
    this.aura = scene.add.ellipse(x, y + 8, 60, 26, 0x7fe9ff, 0.08).setStrokeStyle(2, 0x7fe9ff, 0.8).setDepth(2);
    this.feedback = scene.add
      .text(x, y - 34, '', { fontFamily: 'Georgia, serif', fontSize: '16px', color: '#ffd98a', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setDepth(20)
      .setVisible(false);
    this.trail = scene.add.particles(0, 0, 'spark', {
      follow: this,
      lifespan: 450,
      frequency: 70,
      speed: { min: 5, max: 25 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.5, end: 0 },
      emitting: false,
    });
    this.trail.setDepth(3);
  }

  tick(move: Phaser.Math.Vector2): void {
    this.setVelocity(move.x * PLAYER.speed, move.y * PLAYER.speed);
    const moving = move.lengthSq() > 0;
    if (moving) {
      this.facing.copy(move);
      this.rotation = this.facing.angle();
    }
    this.trail.emitting = moving;
    this.shadow.setPosition(this.x, this.y + 14);
    this.aura.setPosition(this.x, this.y + 8).setAlpha(0.7 + 0.3 * Math.sin(this.scene.time.now / 300));
    this.feedback.setPosition(this.x, this.y - 34);
  }

  showFeedback(label: string): void {
    this.feedback.setText(label).setVisible(true);
    this.feedbackTimer?.remove();
    this.feedbackTimer = this.scene.time.delayedCall(FEEDBACK_MS, () => this.feedback.setVisible(false));
  }
}
