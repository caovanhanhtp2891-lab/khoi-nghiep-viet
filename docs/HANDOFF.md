# Bàn giao Street Edition

Ngày 30/09/2026. Phát triển từ `90bdd778dcb99117187da7c6eabbf5403c42206f`; commit chứa file này xác định phiên bản hiện hành.

Đọc AGENTS.md, STATUS.md, ARCHITECTURE.md, SAVE_FORMAT.md trước khi sửa. Đợt này đã đổi scene, UI, onboarding nam/nữ, auto-hide thông báo, chat offline, migration v3 và bảo vệ save lỗi. Có 15 test và lint/build pass cục bộ.

## File cần biết

- `MainScene.ts`: nền portrait 1024×1536, texture atlas 4 cột×2 hàng, camera fit; đi trên vỉa hè và tương tác NPC.
- `CharacterArt.tsx`: dùng cùng atlas trong React; BASE_URL cho đường dẫn public.
- `migrateSave.ts`: validate và chuyển payload lịch sử về version 3. Đừng xóa tiến độ người chơi để né migration.
- `saveDb.ts`: autosave/backup trong cùng bảng, load lỗi ném exception; runtime blocked không ghi đè.
- `NoticeToast.tsx`: timeout 1000ms riêng mỗi thông báo, cleanup khi unmount.
- `chat.ts`, `gameStore.ts`, `GamePanel.tsx`: hội thoại NPC trên máy; chưa có backend.

## Công việc tiếp theo

1. Xem kết quả kiểm tra live trong STATUS.md và workflow của commit triển khai.
2. Kiểm tra viewport 320/360/390/430, màn hình ngắn, safe area và thiết bị thật. Cloud browser desktop chưa thay thế được kiểm tra máy thật.
3. Cải thiện pathfinding tránh vật cản, ngoại hình/animation đa dạng và hiệu năng; hiện camera chỉ một cảnh vỉa hè.
4. Kiểm thử/cân bằng quyết toán một ngày rồi tách cấu hình nghề mới.

Không nâng dependency ngoài phạm vi; không khẳng định chat online hoặc offline catch-up đã có. Tài sản raster được tạo mới bằng built-in image generation và lưu tại public/assets/art; thông số/prompt ở ASSETS.md và ART_PROMPTS.md.

## Cập nhật 100 cư dân

Đọc thêm NPC_SYSTEM.md. Current payload là v4; cập nhật mới giữ save v1–v3. Renderer NPC là vector riêng (npcArt.ts), generator/check và 100 SVG trong public/assets/npcs-v2. Có 25 test/5 file, lint/build pass cục bộ. Xem STATUS.md cho kết quả live mới nhất.

Ưu tiên tiếp: đo preload SVG/RAM/FPS trên máy thật, upgrade visual, kiểm tra quyết toán ngày mới và deadline qua nửa đêm, thêm lịch NPC cá nhân, nhiều nghề bằng dữ liệu. Không nhầm 100 NPC trong catalog với 100 người vẽ đồng thời (tối đa 10).
