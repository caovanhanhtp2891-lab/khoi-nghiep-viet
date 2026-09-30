# Changelog

Ghi thay đổi đáng kể theo ngày và commit/PR khi có. Hiện trạng nằm ở docs/STATUS.md, việc chưa làm nằm ở docs/BACKLOG.md.

## 2026-09-30 — Street Edition

- Thay nền khu phố bằng nhà phố Việt Nam; atlas nhân vật nam/nữ có mặt và frame đi bộ.
- Thêm chọn giới tính, chạm/phím để đi, NPC bubble và xe máy; chat local có lời đáp và lịch theo giờ game.
- Thiết kế UI portrait màu giấy, đồng hồ luôn thấy, thông báo 1 giây, story gập/mở.
- Phục hồi chữ tiếng Việt hỏng; chặn giao dịch story thiếu hàng/tiền và sửa RNG seed.
- Payload v3 migrate v1/v2, backup/recovery và bảo vệ dữ liệu lỗi; giữ vị trí/gender/chat và pause.
- 15 unit test, lint và build pass cục bộ; thêm tài liệu art và cập nhật bàn giao.

## 2026-09-30 — Bộ tài liệu tiếp nhận cho AI

- Thêm AGENTS.md, bản đồ tài liệu, hiện trạng, kiến trúc, backlog, save format, kiểm thử, quyết định, asset và bàn giao.
- Thêm hướng dẫn Copilot dẫn về AGENTS.md; bổ sung liên kết đọc tài liệu trong README.
- Đối chiếu runtime tại `7fed1c563a7e3493b329c51bcbef10b98e595db5` và ghi lỗi save v2, nội dung story hỏng dấu, lựa chọn bán thiếu hàng để xử lý tiếp.
- Đợt thay đổi này chỉ bổ sung tài liệu, chưa sửa các lỗi đã ghi nhận.

Không tái dựng lịch sử cũ bằng suy đoán; xem git log cho các commit trước đợt này.

## 30/09/2026 — 100 cư dân và nhiệm vụ khu phố

- 100 NPC Việt Nam hư cấu, 50 nghề/vai trò, tuổi 7–82, sprite vector riêng 4 frame/nhân vật.
- Sổ cư dân, tìm kiếm/lọc tuổi/nghề, hồ sơ, chào hỏi/hỏi nghề và quan hệ theo ngày.
- 3 đơn đề nghị/ngày, deadline, giao dịch tồn kho/tiền/giá vốn; 8 milestone thưởng một lần.
- 3 nâng cấp quầy tác động nhu cầu/kho/marketing; save v4 tương thích v1–v3.
- Generator/check asset, 25 unit test; iframe mobile preview dùng đúng viewport nội dung.

## 30/09/2026 — Ba nghề và quyết toán ngày

- Thêm bánh mì/trà sữa, cấu hình riêng giá vốn/giờ bán/thời tiết/công suất.
- Chọn nghề/đổi nghề có quote thu hồi; giữ nhân viên và nâng cấp, chặn việc đang chờ.
- Đơn cư dân theo sản phẩm, 30 báo cáo lời lỗ/dòng tiền, kết thúc ngày sớm.
- Payload v5 tương thích v1–v4; quầy/đồ bán/upgrade thay hình theo state.
- 42 test/6 file +check 100 SVG; lint/build pass cục bộ.
- Sửa load/hydrate lần thứ hai với `cashOpening=null` từ save lịch sử; regression test chạy toàn luồng Dexie và báo cáo ngày cũ.
- Khóa Phaser pointer khi bảng quản lý hoặc onboarding đang mở để thao tác UI không chọn NPC phía sau.
