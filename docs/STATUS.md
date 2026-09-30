# Hiện trạng dự án

Cập nhật 30/09/2026 (Asia/Saigon). Đợt Street Edition phát triển từ commit `90bdd778dcb99117187da7c6eabbf5403c42206f`. Xem git log cho commit chứa tài liệu này.

## Đợt cải thiện mới

- Khu phố Việt Nam dạng nhìn ngang với nhà ống, ban công, mái ngói, cờ, dây điện, quán ăn/cà phê/tạp hóa; nền raster mới.
- Bộ nhân vật nam/nữ có khuôn mặt và 4 frame đi bộ cho mỗi giới tính. Chọn giới tính khi bắt đầu; hồ sơ/HUD dùng hình nhân vật.
- Chạm vỉa hè để di chuyển, phím mũi tên trên máy tính; lưu vị trí chuẩn hóa. Khu vực đi giới hạn trên vỉa hè, chưa phải bản đồ/pathfinding rộng.
- NPC đi lại, bong bóng thoại theo thời gian/thời tiết, chạm NPC để nghe; giới hạn 10 NPC và 3 bubble. Xe máy đi ngang là hiệu ứng trang trí.
- Chat offline trên máy: gửi tin, NPC trả lời theo ngữ cảnh, tin mới theo mỗi 30 phút game; lịch sử tối đa 40 tin. Chưa chat người thật/realtime.
- Giao diện giấy màu kem, xanh lá và nâu; khung portrait tối đa 560px, HUD luôn hiện giờ; nội dung dài cuộn bên trong bảng.
- Thông báo tự ẩn sau 1.000ms; hiệu ứng tiền cũng 1 giây. Bong bóng NPC 3,4 giây để đọc; tình huống chờ lựa chọn không tự biến mất.
- Phục hồi nội dung tiếng Việt hỏng trong story, thông báo và lựa chọn.
- Save payload version 3; migrate v1/v2, validate, backup slot trước khi ghi. Load lỗi chặn tick/autosave và cho tải dữ liệu hoặc khôi phục backup.
- Sửa lựa chọn NPC bán quá hàng/chi quá tiền; seed sinh story trả sau mọi lần rút số.
- Đồng hồ không chạy khi chưa tạo xong nhân vật; pause được giữ qua tải save.

## Bằng chứng kiểm tra

- Bản cũ trên URL Pages đã được chơi thử: bắt đầu, mua/mở quầy, có doanh thu, thấy story hỏng dấu; reload làm quay về 1 triệu và onboarding. Lỗi save được tái hiện qua trình duyệt.
- Bản mới: `pnpm lint`, `pnpm test` (15 test / 4 file), `pnpm build` đều thành công cục bộ.
- Build còn cảnh báo bundle Phaser lớn hơn 500KB; engine được import động, chưa benchmark thiết bị thật.
- Trình duyệt cloud không mở được địa chỉ dev nội bộ; kiểm tra UI bản mới sẽ thực hiện trên Pages sau khi workflow triển khai. Không coi build/unit test là bằng chứng UI mobile.

## Phạm vi chưa có

Một quầy xôi, một nhân viên; chưa nhiều nghề/chuỗi/công ty, boss/leaderboard, đầu tư, multiplayer, cloud save, offline progress hoặc service worker. PNG NPC cũ còn trong kho nhưng scene mới dùng atlas 2 giới tính. Chưa có đủ animation nghề/hướng đi và chưa phải bộ 1.000 nhân vật.

## Việc tiếp theo

Kiểm tra bản Pages mới bằng trình duyệt, bao gồm chọn nữ, chat, di chuyển và reload; ghi kết quả vào đây. Sau đó cân bằng một ca bán, thêm cấu hình nghề, tối ưu tải Phaser và mở rộng ngoại hình NPC. Không dùng tài liệu kế hoạch để tuyên bố hệ thống chưa có đã hoàn thành.
