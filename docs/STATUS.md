# Hiện trạng dự án

Cập nhật 30/09/2026 (Asia/Saigon). Mã cuối được kiểm tra: `d131043b17d7842ea171da06c8fde0523182d2bb`; bản 100 cư dân đầu tiên: `2e6666a54b540b8ea496b0df0efd71ac593fb722`. Commit chứa cập nhật tài liệu này là mốc bàn giao; xem git log/workflow khi tiếp tục.

## Đã triển khai

- Phố Việt Nam nhìn ngang: nhà ống, ban công, mái ngói, cờ, dây điện và hàng quán; nền raster mới. Theme kem/xanh/nâu, portrait tối đa 560px; HUD luôn hiện giờ, nội dung dài cuộn trong bảng.
- Người chơi chọn nam/nữ, có mặt và 4 frame đi bộ; chạm vỉa hè hoặc dùng phím mũi tên, lưu vị trí chuẩn hóa. Chạm đi có tuyến tránh xe xôi, chưa phải pathfinding bản đồ rộng.
- 100 NPC hư cấu riêng, 50 nghề/vai trò, tuổi 7–82; 100 sheet SVG/400 frame, không dùng sprite người chơi. Tối đa 10 cư dân/3 bubble trên cảnh, luân phiên nghề theo ngày/giờ. Sổ cư dân có tìm kiếm, nhóm nghề/tuổi, hồ sơ và hỏi chuyện nghề.
- Tình thân 0–100, lần chào đầu/ngày +3 tình thân/+3 XP; giao đơn +8 tình thân/+15 XP. Chat trên máy, có portrait/id NPC, lịch sử 40 tin và tin mới mỗi 30 phút game; chưa chat người thật.
- 3 đề nghị đặt hàng/ngày, một đơn đang nhận, hạn 120 phút game và phải giao cùng ngày. Giao đủ hàng mới cộng tiền, ghi doanh thu/giá vốn/tồn kho; không nhận lại đơn đã giao.
- 8 mốc hành trình nhận thưởng một lần; 3 nâng cấp quầy tác động nhu cầu mưa, sức chứa kho và marketing. Vẫn một nghề kinh doanh là quầy xôi, một nhân viên.
- Thông báo toast/hiệu ứng tiền tự ẩn sau 1.000ms; bubble NPC 3,4 giây để đọc, tình huống lựa chọn được giữ tới xử lý. Nội dung hỏng dấu tiếng Việt đã viết lại UTF-8; dùng font hệ thống hỗ trợ dấu.
- Save payload v4, migrate v1–v3; giữ tiền/hàng/thời gian/seed/nhân vật. Autosave + backup lần trước, validate trước hydrate. Load lỗi chặn tick/autosave và cho export raw/restore backup. Pause giữ qua reload; chưa onboarding thì chưa chạy đồng hồ.
- `?demo=1` dùng database riêng; `mobile-preview.html` đổi viewport CSS iframe, không thay tiến độ chính.

## Bằng chứng kiểm tra

| Kiểm tra | Kết quả |
|---|---|
| Cục bộ sau sửa cuối | `pnpm lint`, `pnpm test`, `pnpm build` exit 0; 25 test/5 file; 100 SVG khớp generator |
| GitHub Actions | Run 36700165778 (100 cư dân) và 36700877237 (refine) completed/success; lint/test/build/deploy Pages |
| Tải live | Nền, nhân vật nam/nữ, SVG cư dân, biển chữ và 6 mục điều hướng hiển thị đúng |
| Tiến độ chính | Reload giữ Minh, 715.000 VNĐ, ngày 8 13:20 và pause; không đặt lại dữ liệu |
| Onboarding thử | Trước đó tạo Lan thử nghiệm, chọn nữ, đi trên vỉa hè; reload bản v4 vẫn giữ nhân vật/vị trí hiển thị |
| Cư dân | Tìm “Bác sĩ” trả hai hồ sơ; chào An/Bông/Bác sĩ Diệp; hỏi nghề đúng vai trò; An giữ 3 tình thân sau lần hỏi thứ hai và reload |
| Nhiệm vụ | Làm quen 3 người, nhận 15.000đ một lần, trạng thái Đã nhận/disabled vẫn giữ sau reload |
| Quầy/nâng cấp | Mua quầy trừ 480.000, nhận 20 phần; tủ trừ 140.000, maxInventory 60→90, nút Đã lắp/disabled |
| Giao đơn | Cô Hương 4 phần ×20.000: tiền 395.000→475.000, kho 20→16, doanh thu 80.000, giá vốn 32.000; đơn Đã giao hôm nay |
| Save mở rộng | Reload giữ 475.000, 16/90 hàng, nâng cấp, quan hệ, thưởng và đơn đã giao, ngày 1 06:50/pause |
| Viewport | 320×568, 360×640, 390×740, 430×844: scrollWidth/scrollHeight của game bằng viewport; bảng dài cuộn nội bộ |
| Thông báo | Thấy toast ngay sau action, biến mất ở lần quan sát tiếp; source timeout 1000ms, không phát lại khi reload |
| Console quan sát | Không thấy lỗi game/asset; các log lỗi xuất hiện thuộc extension trình duyệt, không thuộc game |
| Tài liệu | Link Markdown nội bộ không thiếu file; renderer/asset và schema được ghi trong NPC_SYSTEM/SAVE_FORMAT |

Ảnh kiểm thử bản cuối được gửi trong phiên làm việc, không đưa ảnh tiến độ lên kho công khai. Kiểm tra live trên Chrome cloud; viewport CSS không thay cho thiết bị thật. Dev nội bộ không truy cập được từ cloud, vì vậy chơi thử trên Pages sau deploy. Bản cũ đã tái hiện story hỏng dấu và save v2 không tải trước khi sửa.

## Giới hạn còn lại

- Phaser bundle khoảng 1.375KB trước gzip (357,8KB gzip), build có cảnh báo >500KB; preload 100 SVG chưa đo RAM/FPS/tải trên điện thoại thật.
- NPC dùng renderer vector với phối mặt/tóc/màu/đồ nghề; chưa 16 hướng hoặc lịch cá nhân/AI ngôn ngữ. Đơn giao từ bảng, chưa đi giao vật lý.
- Nâng cấp có hiệu quả economy và trạng thái UI, chưa thêm visual riêng lên xe.
- Chưa nhiều nghề kinh doanh/chuỗi/công ty, boss/leaderboard, đầu tư thật, multiplayer/backend, cloud save, offline progress hoặc service worker.
- Chưa import UI, backup nhiều phiên hoặc khóa save giữa nhiều tab. Chưa kiểm thử quyết toán đầy đủ một ngày, hardware keyboard/safe area/bàn phím thật hay benchmark Android/iOS.

Xem [BACKLOG.md](BACKLOG.md) và [HANDOFF.md](HANDOFF.md) cho việc tiếp; PLAN.md là tầm nhìn, không phải tính năng đã có.
