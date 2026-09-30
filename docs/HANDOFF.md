# Bàn giao cho AI phiên tiếp theo

## Mốc bắt đầu

- Kho: `caovanhanhtp2891-lab/khoi-nghiep-viet`, nhánh `main`.
- Mã runtime đã đọc: `7fed1c563a7e3493b329c51bcbef10b98e595db5`.
- Ngày: 30/09/2026 (Asia/Saigon).
- Phiên này: bổ sung tài liệu AI và liên kết README; không sửa logic game.
- Đọc AGENTS.md → STATUS.md → ARCHITECTURE.md → BACKLOG.md trước khi triển khai.

## Điểm tiếp tục đề xuất

Bắt đầu B01, vì save v2 đang bị loader loại bỏ:

1. Đọc `src/services/saveDb.ts`, `src/store/initialState.ts`, `src/store/gameStore.ts`, `src/domain/types.ts` và SAVE_FORMAT.md.
2. Viết test save/load round-trip v2 và fixture lịch sử v1 thiếu story. Xác nhận test tái hiện lỗi hiện tại.
3. Sửa loader/migration/validation phối hợp với hydrate; phân biệt save vắng, hỏng và không hỗ trợ. Giữ khả năng khôi phục trước autosave ghi đè.
4. Chơi thử reload sau autosave, kiểm tra tiền, tồn kho, thời gian, story và seed.
5. Cập nhật tài liệu với commit và kết quả kiểm tra thực tế; chỉ đánh dấu B01 xong khi đủ nghiệm thu.

Sau đó xử lý B02 (dấu tiếng Việt), B03 (bán hàng qua story thiếu tồn kho), B04 (seed sinh choices). Đây là đề xuất; ưu tiên yêu cầu mới nhất của chủ dự án.

## Giới hạn kiểm chứng

CI mốc runtime báo success, nhưng chưa có test save/story/UI và chưa chơi thử trong phiên tài liệu. Cài dependency cục bộ bị chặn npm; không ghi là đã chạy lint/test/build cục bộ. Nếu mã trên main đã đổi, đọc diff từ mốc trên và cập nhật hiện trạng trước khi sửa.

## Mẫu bàn giao cuối phiên

- Task và phạm vi hoàn thành:
- Commit/PR và nhánh:
- File quan trọng đã đổi:
- Kết quả lệnh/test/chơi thử có bằng chứng:
- Phần đang dang dở hoặc bị chặn:
- Thay đổi schema và tương thích save:
- Việc đầu tiên cho AI tiếp theo + tiêu chí hoàn thành:

Không đưa token, mật khẩu hoặc suy đoán chưa được kiểm chứng vào bàn giao.
