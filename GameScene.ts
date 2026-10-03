import Phaser from 'phaser';
import { WORLD } from '../config/constants';
import { Player } from '../entities/Player';
import { InputManager } from '../systems/InputManager';
import { GameUI } from '../ui/GameUI';

// [x, y, bán kính] - đá/trụ trang trí có va chạm
const PROPS: Array<[number, number, number]> = [
  [420, 330, 26], [700, 260, 18], [1180, 340, 30], [1350, 720, 22],
  [300, 820, 28], [620, 980, 20], [980, 1000, 34], [1250, 1040, 18],
  [1450, 380, 24], [200, 480, 20], [880, 420, 16], [520, 640, 22],
];

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private inputMgr!: InputManager;
  private ui!: GameUI;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width: W, height: H, margin: M } = WORLD;
    Player.createTextures(this);
    this.drawArena();

    const props = this.physics.add.staticGroup();
    PROPS.forEach(([x, y, r], i) => {
      const rock = this.add.circle(x, y, r, i % 3 === 0 ? 0x24302f : 0x2a2f3a).setStrokeStyle(2, 0x4b556b).setDepth(2);
      props.add(rock);
      (rock.body as Phaser.Physics.Arcade.StaticBody).setCircle(r);
    });

    this.physics.world.setBounds(M, M, W - 2 * M, H - 2 * M);
    this.player = new Player(this, W / 2, H / 2);
    this.physics.add.collider(this.player, props);

    this.cameras.main.setBounds(0, 0, W, H).startFollow(this.player, true, 0.12, 0.12);

    this.inputMgr = new InputManager(this);
    this.ui = new GameUI(this);
    this.ui.setHp(this.player.hp, this.player.maxHp);

    (['attack', 'dodge', 'parry'] as const).forEach((a) =>
      this.inputMgr.on(a, () => {
        const label = a.toUpperCase();
        console.log(label);
        this.player.showFeedback(label);
      }),
    );
  }

  update(): void {
    this.player.tick(this.inputMgr.getMoveVector());
  }

  private drawArena(): void {
    const { width: W, height: H, margin: M } = WORLD;
    const g = this.add.graphics().setDepth(0);
    g.fillStyle(0x040508, 1).fillRect(0, 0, W, H); // vùng ngoài arena
    g.fillStyle(0x0d1018, 1).fillRect(M, M, W - 2 * M, H - 2 * M);
    g.lineStyle(1, 0x3a4660, 0.18);
    for (let x = M; x <= W - M; x += 80) g.lineBetween(x, M, x, H - M);
    for (let y = M; y <= H - M; y += 80) g.lineBetween(M, y, W - M, y);

    // Trận pháp ở trung tâm
    const cx = W / 2, cy = H / 2;
    g.lineStyle(2, 0x5fc8e8, 0.35).strokeCircle(cx, cy, 160).strokeCircle(cx, cy, 105);
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i;
      g.lineBetween(cx + Math.cos(a) * 105, cy + Math.sin(a) * 105, cx + Math.cos(a) * 160, cy + Math.sin(a) * 160);
    }
    g.lineStyle(3, 0x5fc8e8, 0.7).strokeRect(M, M, W - 2 * M, H - 2 * M); // viền arena
  }
}
