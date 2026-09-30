# Hướng dẫn GitHub Copilot

Dự án: Khởi Nghiệp Việt, web game kinh doanh 2D bối cảnh Việt Nam, ưu tiên điện thoại và tiếng Việt.

Nguồn hướng dẫn chung nằm ở [AGENTS.md](../AGENTS.md). Đọc thêm [docs/STATUS.md](../docs/STATUS.md), [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md), [docs/BACKLOG.md](../docs/BACKLOG.md) và [docs/HANDOFF.md](../docs/HANDOFF.md) trước khi sửa mã.

- PLAN.md là kế hoạch dài hạn, không phải hiện trạng đã hoàn thành.
- Logic nghiệp vụ trong domain/store; Phaser chỉ hiển thị. Không tạo doanh thu bằng animation hoặc nút click vô hạn.
- Giữ 18 tuổi/1 triệu vốn và 2 giây thực = 5 phút game ở 1× trừ khi có yêu cầu thay đổi.
- Đổi dữ liệu lưu phải đọc SAVE_FORMAT.md, giữ save cũ và kiểm thử migration.
- Dùng TypeScript/pnpm, giữ UTF-8, không nâng dependency ngoài phạm vi.
- Kiểm tra phù hợp theo TESTING.md; nêu rõ điều chưa chạy. Cập nhật STATUS/HANDOFF/BACKLOG khi hoàn tất.

Không nhân bản toàn bộ hướng dẫn ở đây; cập nhật AGENTS.md làm nguồn chung khi quy tắc thay đổi.
