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


## 30/09/2026 — Đối thủ kinh doanh và đua top

- Ba chủ quầy dùng mô phỏng/giá vốn/công suất/weather chung, tự chi vốn để nhập hàng, marketing, tuyển người và nâng cấp; seed riêng.
- Cư dân →Đua top: tài sản/doanh thu/lợi nhuận, đồng hạng, hồ sơ sổ quầy và tin cạnh tranh vào Chat.
- Thi đua mỗi ngày cùng nghề, mốc lợi nhuận/sản phẩm lúc nhận, quyết toán thắng/thua và thưởng50.000đ/60XP một lần.
- Áp lực cùng nghề giảm12% nhu cầu đối xứng, hàng Cạnh tranh trong Vận hành; hiệu ứng bán dùng đơn vị nghề.
- Payload v6 giữ v1–v5, NPC bắt đầu hiện tại, save cũ thi đua từ ngày tiếp theo, giữ đơn trà sữa/report/nullable cashOpening.
- 57 test/7 file và check100SVG; lint/TypeScript/build pass. Kiểm tra live và giới hạn xem STATUS.md.

## 30/09/2026 — Giao diện gọn, 120 cư dân và hội thoại

- Bảng theo dvh, header/đóng luôn thấy; tab chuyển về đầu, nhu cầu/nâng cấp gập, composer chat tách khỏi lịch sử. Sửa portrait đối thủ bị cắt.
- 20 cư dân thêm vào cuối danh mục, 60 nghề; công an/dân quân/cứu hỏa/mũ kê-pi/bộ đàm/máy tính kế toán; 120 sheet/480 frame.
- Sáu phương tiện hai chiều, tối đa ba xe, chỉ trang trí.
- 1.000 chuỗi từ 50 tình huống, NPC hỏi đáp, chat chọn người/gợi ý; quen biết chỉ sau giao lưu, giới hạn bond/XP chung chào và chat.
- 26 nhu cầu tình huống khách, đơn vị phục vụ theo nghề. Giữ schema v6, ID/pool đơn cũ; 64 test/8 file và generator120 pass.

## 30/09/2026 — Màn hình chính và thao tác nhanh

- Chuyển thông tin quầy và thao tác sang hàng riêng dưới khu phố, bỏ caption/thời tiết lặp và thẻ hướng dẫn che cảnh.
- Nút nhập có số lượng/chi phí, khóa khi thiếu tiền/đầy kho; nút mở theo giờ bán/tồn kho, trạng thái quầy khi pause. Dùng lại giao dịch store, không thay save v6.
- Điều khiển thời gian 44px với nút chuyển tốc độ; tình huống giữ tới xử lý, cuộn trong cảnh.
- Bảng tự focus nút đóng, Escape để thoát, Tab giữ trong bảng và trả focus cho thao tác trước.
