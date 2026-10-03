import Phaser from 'phaser';

export type ActionName = 'attack' | 'dodge' | 'parry';

/** Gom input: vector di chuyển + sự kiện 'attack' | 'dodge' | 'parry'. */
export class InputManager extends Phaser.Events.EventEmitter {
  private keys: Record<string, Phaser.Input.Keyboard.Key>;
  private move = new Phaser.Math.Vector2();

  constructor(scene: Phaser.Scene) {
    super();
    const kb = scene.input.keyboard!;
    this.keys = kb.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT') as Record<string, Phaser.Input.Keyboard.Key>;
    kb.addCapture('SPACE');

    const bind = (code: string, action: ActionName) =>
      kb.on(`keydown-${code}`, (e: KeyboardEvent) => {
        if (!e.repeat) this.emit(action);
      });
    bind('J', 'attack');
    bind('SPACE', 'dodge');
    bind('K', 'parry');

    scene.input.mouse?.disableContextMenu();
    scene.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      if (p.rightButtonDown()) this.emit('parry');
      else if (p.leftButtonDown()) this.emit('attack');
    });
  }

  /** Vector đã normalize: đi chéo không nhanh hơn đi thẳng. */
  getMoveVector(): Phaser.Math.Vector2 {
    const k = this.keys;
    const x = Number(k.D.isDown || k.RIGHT.isDown) - Number(k.A.isDown || k.LEFT.isDown);
    const y = Number(k.S.isDown || k.DOWN.isDown) - Number(k.W.isDown || k.UP.isDown);
    this.move.set(x, y);
    if (x !== 0 || y !== 0) this.move.normalize();
    return this.move;
  }
}
