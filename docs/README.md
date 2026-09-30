# Bản đồ tài liệu

AI mới nên bắt đầu từ [AGENTS.md](../AGENTS.md), rồi đọc [STATUS.md](STATUS.md), [ARCHITECTURE.md](ARCHITECTURE.md) và [HANDOFF.md](HANDOFF.md).

| Tài liệu | Mục đích | Khi cập nhật |
|---|---|---|
| [STATUS.md](STATUS.md) | Hiện trạng, lỗi, bằng chứng kiểm tra | Cuối phiên phát triển |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Vai trò module và luồng dữ liệu | Đổi kiến trúc hoặc luồng |
| [BACKLOG.md](BACKLOG.md) | Việc cần làm và tiêu chí hoàn thành | Bắt đầu/kết thúc task |
| [SAVE_FORMAT.md](SAVE_FORMAT.md) | Dữ liệu lưu và nâng phiên bản | Đổi snapshot hoặc persistence |
| [TESTING.md](TESTING.md) | Kiểm thử tự động và chơi thử | Đổi hành vi, bổ sung test |
| [DECISIONS.md](DECISIONS.md) | Quyết định hiện có và câu hỏi mở | Chốt/đổi quyết định |
| [ASSETS.md](ASSETS.md) | NPC, đường dẫn và quy tắc hình ảnh | Thêm/đổi asset |
| [ART_PROMPTS.md](ART_PROMPTS.md) | Prompt hình phố và atlas nhân vật | Khi tạo lại art |
| [HANDOFF.md](HANDOFF.md) | Điểm tiếp tục cho phiên kế tiếp | Cuối phiên |
| [CHANGELOG.md](../CHANGELOG.md) | Nhật ký thay đổi đáng kể | Hoàn thành thay đổi |
| [PLAN.md](../PLAN.md) | Thiết kế và lộ trình tổng thể | Đổi định hướng sản phẩm |

## Quy tắc tránh tài liệu lỗi thời

Mỗi thông tin trạng thái phải có mốc commit hoặc ngày đối chiếu. Liên kết đến mã thay vì sao chép toàn bộ mã. Phân biệt chức năng đang chạy, giao diện mẫu, ý tưởng dài hạn và lỗi đã xác nhận bằng đọc mã hoặc thử thực tế. Khi cập nhật ghi đè phần hiện trạng cũ; lịch sử dài đưa vào changelog.

- [NPC_SYSTEM.md](NPC_SYSTEM.md): 100 cư dân, renderer SVG, quan hệ, đơn đặt, milestone và nâng cấp.

- [BUSINESS_SYSTEM.md](BUSINESS_SYSTEM.md): ba nghề, đổi nghề, dòng tiền/lợi nhuận và báo cáo ngày.
