# Hình ảnh, NPC và nội dung

## Asset hiện có

Mốc mã: `7fed1c563a7e3493b329c51bcbef10b98e595db5`, ngày 30/09/2026.

| Đường dẫn | Cách dùng |
|---|---|
| `public/assets/npcs/user-npc-01.png` đến `user-npc-12.png` | 12 ảnh NPC được preload ở `MainScene.ts` |
| `public/icon.svg` | Icon ứng dụng |
| `public/manifest.webmanifest` | Metadata web app; không thay thế service worker |

`MainScene.preload()` nạp key `user-npc-01`…`user-npc-12`. `createNpc()` hiển thị ảnh 48×62, origin (0.5, 0.86), bóng đổ và tween lên/xuống. Đây là ảnh tĩnh với hiệu ứng chuyển động, chưa phải sprite sheet walk/idle nhiều frame. Nhân vật chính, nhà, cây và quầy còn được vẽ bằng các shape/graphics.

Không coi 12 ảnh này là bộ 1.000 nhân vật hoặc bộ animation đã hoàn thiện. Kích thước pixel gốc, nguồn tạo và quyền sử dụng chưa được xác minh trong phiên tài liệu.

## Quy tắc khi thêm hình ảnh

1. Đặt tên ổn định, dễ tìm; ghi nơi dùng và key preload.
2. Đường dẫn public được phục vụ tại base URL, không thêm `public/` vào URL trình duyệt. Kiểm tra cả Vite dev và GitHub Pages dưới đường dẫn con.
3. Nếu đổi số lượng NPC, sửa các chỗ preload, modulo và random selection đang hard-code 12.
4. Nếu chuyển sang spritesheet, ghi frame size/count, tên animation, tốc độ, origin và hướng nhìn; không giả định PNG hiện có là sheet.
5. Kiểm tra nền trong suốt, tỷ lệ hiển thị, ảnh không méo và chi phí tải trên điện thoại.
6. Ghi nguồn/chủ sở hữu/quyền dùng cho mỗi bộ; không tự khẳng định giấy phép khi chưa có bằng chứng.

## Nội dung tiếng Việt

Chuỗi tình huống hiện nằm trong `src/domain/situations.ts`, UI ở components và thông báo ở store. Nhiều chuỗi story đang hỏng dấu ngay trong nguồn (B02). Phục hồi từ nguồn gốc hoặc biên tập lại tiếng Việt có nghĩa; đổi encoding đơn thuần không phục hồi chữ đã thành dấu hỏi.

## Mẫu đăng ký asset mới

| File / nhóm | Loại / frame | Nguồn | Quyền sử dụng đã xác minh | Nơi dùng | Ghi chú |
|---|---|---|---|---|---|
| Điền khi bổ sung | PNG/sheet/SVG/audio | Link hoặc tác giả | Bằng chứng hoặc chưa xác minh | Module/key | Kích thước/origin |
