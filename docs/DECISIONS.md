# Quyết định và câu hỏi mở

Mốc đối chiếu: 30/09/2026, `7fed1c563a7e3493b329c51bcbef10b98e595db5`.

## Nền tảng sản phẩm

Các định hướng sau có trong PLAN.md và yêu cầu dự án; phải giữ khi phát triển nếu chưa có chỉ đạo mới:

| ID | Định hướng | Lý do / nguồn |
|---|---|---|
| D01 | 18 tuổi, 1 triệu VNĐ ban đầu | Hành trình khởi nghiệp từ vốn nhỏ; PLAN mục 2 |
| D02 | 2 giây thực = 5 phút game ở 1× | Nhịp thời gian chung; PLAN mục 7, constants hiện có |
| D03 | Kinh doanh tự vận hành, không clicker cộng tiền | Trải nghiệm mô phỏng; PLAN mục 1–4 |
| D04 | Tiếng Việt, bối cảnh Việt Nam, mobile-first | Đối tượng sản phẩm; PLAN mục 3, 20 |
| D05 | Logic kinh tế tách khỏi Phaser | Kiểm thử và mở rộng; PLAN mục 22, mã hiện tại |

## Lựa chọn kỹ thuật đang tồn tại

Đây là mô tả implementation, không phải mọi lựa chọn đã được chủ dự án phê duyệt vĩnh viễn:

- Một frontend Vite, React/Phaser/Zustand, chưa có server.
- IndexedDB với một slot autosave. Chưa có cloud sync hoặc định danh máy vật lý.
- Một quầy xôi và một nhân viên. Đây là phạm vi prototype, không giới hạn tầm nhìn.
- RNG có seed trong domain; randomness hình ảnh của scene độc lập.
- Workflow deploy Pages khi main thay đổi; Vite `base: './'` để hỗ trợ đường dẫn tương đối.

## Định hướng kế hoạch chưa triển khai

PLAN.md đề xuất offline trước, multiplayer sau; đầu tư dùng tài sản hư cấu; online phải có server quyết định giao dịch; không pay-to-win. Không diễn giải các định hướng này là tính năng đã có.

## Câu hỏi chưa chốt

- Điều khiển nhân vật bằng chạm để đi hay joystick? PLAN mục 41 chưa chốt.
- Portrait-only hay landscape đầy đủ? Chưa có xác nhận sản phẩm.
- Khi chưa hoàn tất onboarding hoặc đang chọn story, thời gian có cần tự pause? Runtime hiện chỉ xét `world.paused`.
- Offline progress tối đa bao lâu; backup nhiều slot; xử lý nhiều tab thế nào?
- Chọn giới tính/tuổi và hướng mỹ thuật/animation nhân vật cuối cùng?
- Thứ tự nghề mới, boss, leaderboard và mô hình chat online?
- Nguồn/quyền sử dụng cuối cùng của hình ảnh và âm thanh?

## Mẫu quyết định mới

```text
ID / ngày / trạng thái (đề xuất, được chốt, thay thế):
Vấn đề và yêu cầu liên quan:
Các phương án đã xét:
Lựa chọn + lý do:
Hệ quả cho code, dữ liệu cũ, kiểm thử:
Ai/yêu cầu nào xác nhận:
Quyết định cũ bị thay thế nếu có:
```

Không ghi một quyết định là “được chốt” chỉ vì AI thấy hợp lý.

## Quyết định implementation trong Street Edition

- Nhân vật chọn nam/nữ; vị trí đi lại lưu normalized trên vỉa hè. Chạm để đi, phím mũi tên hỗ trợ desktop; chưa pathfinding toàn bản đồ.
- Giao diện portrait giới hạn 560px trên desktop để giữ cảm giác mobile; vẫn resize theo chiều cao.
- Tạm giữ thời gian khi chưa hoàn tất tạo nhân vật; pause theo lựa chọn người chơi được giữ khi tải save.
- Thông báo hệ thống 1 giây theo yêu cầu mới; bubble NPC 3,4 giây và story chờ xử lý để nội dung đọc được.
- Built-in image generation tạo raster mới, không lấy hình UI tham chiếu làm nền sao chép.
