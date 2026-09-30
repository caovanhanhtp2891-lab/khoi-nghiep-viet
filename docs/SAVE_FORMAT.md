# Save format version 3

Cập nhật 30/09/2026 trong đợt Street Edition. Database Dexie `khoi-nghiep-viet` vẫn version 1, bảng `saves` index `id, savedAt`; envelope schemaVersion vẫn 1. Payload version game mới là 3.

| Slot | Mục đích |
|---|---|
| autosave | Tiến độ mới nhất |
| backup | Bản trước lần ghi autosave gần nhất; không phải lưu trữ nhiều phiên lâu dài |

Mỗi record: `{ id, schemaVersion: 1, savedAt: ISO string, payload }`. `payload` được đọc như unknown, validate/migrate trước hydrate. Một transaction ghi backup rồi autosave để không tách giao dịch.

## Thay đổi payload

`GameSnapshot` vẫn có player/world/business/dayStats/lifetime/story/tutorial/notices; thêm `player.gender` (male/female), `player.position` ({x,y} chuẩn hóa), `chat` và `chatSeq`.

- v1: có thể thiếu story; thêm defaults.
- v2: có story, chưa gender/position/chat; thêm defaults, giữ tiền/tồn kho/thời gian/seed.
- v3: validate giới tính/vị trí, các nhóm số liệu và story; clamp vị trí trong vỉa hè.
- Loader không còn loại v2. Hàm `migrateSnapshot()` riêng ở domain.
- Thông báo transient không được phát lại khi load. Story cũ có title hỏng dấu hỏi bị bỏ tình huống đó; tiến độ kinh tế vẫn giữ.
- Chat valid tối đa 40 tin, history story tối đa 8. Migration không chạy offline catch-up.

Runtime đọc save trước tick/autosave; khi loader thất bại, trạng thái blocked bảo vệ slot hiện có. UI cho tải raw records JSON hoặc khôi phục backup hợp lệ. Không tự xóa/reset dữ liệu lỗi. `restoreBackup()` đưa payload hợp lệ sang autosave; ghi chú slot backup chỉ là lần ghi trước.

Autosave mỗi 5 giây, khi tab ẩn và khi runtime cleanup; tránh chạy hai persist đồng thời. Đồng hồ không chạy trước onboarding. Pause giữ qua reload. Vị trí cập nhật khi đến đích hoặc thả phím; autosave khi đang đi có thể giữ vị trí trước hành trình.

## Vị trí lưu và giới hạn

IndexedDB theo origin/profile trình duyệt; không phải ID phần cứng, không đồng bộ nhiều máy. Đổi domain, xóa dữ liệu website hay chế độ riêng tư ảnh hưởng khả năng tìm save. Chưa có import UI, lịch sử backup nhiều phiên, xử lý xung đột nhiều tab hoặc cloud save.

## Kiểm thử

`saveDb.test.ts` dùng fake-indexeddb: load v2, migrate v1 thiếu story, round-trip v3 nữ/vị trí/chat/tiền/seed/pause, dữ liệu hỏng/phiên bản tương lai giữ nguyên, khôi phục backup. Khi thêm trường/phiên bản mới tiếp tục fixture cũ và thử reload browser, không chỉ test interface.

`?demo=1` dùng database `khoi-nghiep-viet-demo` riêng, giữ nguyên database hồ sơ chính. Đây là chế độ test để tạo nhân vật/chơi thử mà không đặt lại tiến độ chính.
