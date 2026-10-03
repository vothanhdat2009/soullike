# Resonance of the Immortal

Prototype game web **Top-down 2D Soulslike** phong cách Tu Tiên / Tiên Hiệp (tên tạm).

## Công nghệ
TypeScript · Phaser 3 · Vite · HTML5

## Điều khiển
| Hành động | Phím |
|---|---|
| Di chuyển | W A S D / phím mũi tên (8 hướng) |
| Attack | J / chuột trái |
| Dodge | Space |
| Parry | K / chuột phải |

(Attack/Dodge/Parry hiện chỉ hiện chữ feedback để test input.)

## Cài đặt & chạy
```bash
npm install
npm run dev      # mở http://localhost:5173
npm run build    # kiểm tra TypeScript + build production vào dist/
npm run preview  # chạy thử bản build
```

## Cấu trúc
```
src/
├── main.ts
├── config/      constants.ts, gameConfig.ts
├── scenes/      GameScene.ts
├── entities/    Player.ts
├── systems/     InputManager.ts
└── ui/          GameUI.ts
```

## Hiện có (Milestone 1)
Arena + trận pháp placeholder, đá có va chạm, Player 8 hướng (normalize), camera theo Player, HP bar, input placeholder.

## Roadmap
2 Attack · 3 Enemy · 4 Damage/HP · 5 Dodge + i-frame · 6 Parry · 7 Stagger/Break · 8 Boss · 9 Qi/Cultivation · 10 Skills/Builds

## Deploy GitHub Pages
`vite.config.ts` đã đặt `base: './'`; deploy thư mục `dist/` (ví dụ bằng GitHub Actions hoặc nhánh gh-pages).
