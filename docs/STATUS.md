# Hiện trạng dự án

Cập nhật 30/09/2026 (Asia/Saigon). Mã runtime cuối được kiểm tra: `18a6569435ef271fda00f7d486d9747ead378992`; bản ba nghề đầu tiên: `ae5153a9f95cc63321138088aea89f7a9100c943`. Commit chứa cập nhật tài liệu này là mốc bàn giao; xem git log/workflow khi tiếp tục.

## Đã triển khai

- Phố Việt Nam nhìn ngang: nhà ống, ban công, mái ngói, cờ, dây điện và hàng quán; nền raster mới. Theme kem/xanh/nâu, portrait tối đa 560px; HUD luôn hiện giờ, nội dung dài cuộn trong bảng.
- Người chơi chọn nam/nữ, có mặt và 4 frame đi bộ; chạm vỉa hè hoặc dùng phím mũi tên, lưu vị trí chuẩn hóa. Chạm đi có tuyến tránh xe xôi, chưa phải pathfinding bản đồ rộng.
- 100 NPC hư cấu riêng, 50 nghề/vai trò, tuổi 7–82; 100 sheet SVG/400 frame, không dùng sprite người chơi. Tối đa 10 cư dân/3 bubble trên cảnh, luân phiên nghề theo ngày/giờ. Sổ cư dân có tìm kiếm, nhóm nghề/tuổi, hồ sơ và hỏi chuyện nghề.
- Tình thân 0–100, lần chào đầu/ngày +3 tình thân/+3 XP; giao đơn +8 tình thân/+15 XP. Chat trên máy, có portrait/id NPC, lịch sử 40 tin và tin mới mỗi 30 phút game; chưa chat người thật.
- 3 đề nghị đặt hàng/ngày, một đơn đang nhận, hạn 120 phút game và phải giao cùng ngày. Giao đủ hàng mới cộng tiền, ghi doanh thu/giá vốn/tồn kho; không nhận lại đơn đã giao.
- 8 mốc hành trình nhận thưởng một lần; 3 nâng cấp quầy tác động nhu cầu mưa, sức chứa kho và marketing. Hiện một quầy hoạt động với ba lựa chọn xôi/bánh mì/trà sữa và một nhân viên.
- Thông báo toast/hiệu ứng tiền tự ẩn sau 1.000ms; bubble NPC 3,4 giây để đọc, tình huống lựa chọn được giữ tới xử lý. Nội dung hỏng dấu tiếng Việt đã viết lại UTF-8; dùng font hệ thống hỗ trợ dấu.
- Save payload v5, migrate v1–v4; giữ tiền/hàng/thời gian/seed/nhân vật. Autosave + backup lần trước, validate trước hydrate. Load lỗi chặn tick/autosave và cho export raw/restore backup. Pause giữ qua reload; chưa onboarding thì chưa chạy đồng hồ.
- `?demo=1` dùng database riêng; `mobile-preview.html` đổi viewport CSS iframe, không thay tiến độ chính.

## Bằng chứng lịch sử — bản 100 cư dân

| Kiểm tra | Kết quả |
|---|---|
| Cục bộ đợt 100 cư dân | `pnpm lint`, `pnpm test`, `pnpm build` exit 0; 25 test/5 file; 100 SVG khớp generator |
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
- Nâng cấp có hiệu quả economy và trạng thái UI, đã thêm mái che rộng, tủ bên xe và viền biển hiệu lên cảnh.
- Đã có ba nghề trên một quầy; chưa nhiều quầy/chuỗi/công ty, boss/leaderboard, đầu tư thật, multiplayer/backend, cloud save, offline progress hoặc service worker.
- Chưa import UI, backup nhiều phiên hoặc khóa save giữa nhiều tab. Quyết toán một ngày đã đối soát trong unit test; chưa kiểm tra hardware keyboard/safe area/bàn phím thật hay benchmark Android/iOS.

Xem [BACKLOG.md](BACKLOG.md) và [HANDOFF.md](HANDOFF.md) cho việc tiếp; PLAN.md là tầm nhìn, không phải tính năng đã có.

## Đợt nhiều nghề và quyết toán

Phát triển từ main `5b95a9bfbedc9001e3c0b9e7cf8c30c1513ff23e`. Thêm careers/accounting, ba nghề giá/giờ/công suất/weather riêng, chọn/chuyển nghề có quote thu hồi, đơn cư dân theo sản phẩm, report 30 ngày và kết thúc ngày sớm. Payload v5 giữ tiến độ v1–v4. Quầy đổi hình xôi/bánh mì/trà sữa và hiển thị 3 upgrade.

Cục bộ: lint, 42 test/6 file +check 100 SVG, TypeScript/build đều exit 0. Full ca xôi đã đối soát trong test cùng restock/marketing/tuyển/thưởng/thuê/lương; tự qua ngày và kết thúc sớm không tính phí trùng. Lỗi `cashOpening=null` khi hydrate lần thứ hai đã được tái hiện live và sửa; regression test kiểm tra load→hydrate→save→reload và báo cáo ngày cũ. Phaser input khóa khi bảng/onboarding mở. Bằng chứng live cuối bổ sung dưới đây. Chi tiết BUSINESS_SYSTEM.md.


### Xác nhận live bản ba nghề

Chrome cloud, 30/09/2026, mã `18a6569435ef271fda00f7d486d9747ead378992`. Actions run 36711577075 (tính năng), 36712509013 (migration), 36713078315 (khóa input) đều completed/success, gồm lint/test/build/deploy. Test cuối 42/6 file; TypeScript/build exit 0, 100 sheet SVG khớp source.

| Kiểm tra | Kết quả thực tế |
|---|---|
| Tương thích | Demo v4 chưa onboarding tái hiện lỗi kiểm tra cashOpening=null lần hai; bản sửa tải được, tạo Lan thử nghề/nữ và reload tiếp được. Không xóa hoặc khôi phục ghi đè save để né lỗi |
| Chọn nghề | Trước mua thấy ba gói 480.000/600.000/800.000; mua bánh mì trừ 600.000, tiền 400.000, kho 20/70 |
| Bán bánh mì | Bán tự động theo tick: 20 ổ, doanh thu 500.000, giá vốn 180.000; kho 0, tiền 900.000 |
| Đổi nghề | Tủ 140.000 + tuyển 70.000 → tiền 690.000. Quote trà sữa 580.000 dụng cụ +220.000 hàng −210.000 thu hồi =590.000; sau đổi 100.000, kho 20/80, giữ tủ và Chị Mai/công suất 5 |
| Ca trà sữa | 09:00 nút Mở lúc 10:00 disabled; 11:20 cho mở. Tick bán 2 ly ×32.000: tiền 164.000, doanh thu chung 564.000, kho 18 |
| Quyết toán lần 1 | Trừ 155.000 thuê/lương đúng một lần, sang ngày2 05:30 và giữ pause/kho; tiền 9.000, report ngày1 profit −3.000. Ngày từ save cũ hiển thị Chưa có dữ liệu đầu ngày |
| Đơn trà sữa | Ngày2 giao 5/6/3 ly, tổng 150.000/192.000/102.000; doanh thu 444.000, giá vốn 154.000, kho18→4; đơn hoàn thành không nhận lại |
| Báo cáo lần 2 | Đầu ngày9.000 +444.000 −155.000 =298.000; profit135.000, UI Dòng tiền đã đối soát khớp. Hai báo cáo có trong dropdown |
| Lưu/reload | Mở phiên mới giữ nữ/Lan thử nghề, tiền298.000, ngày3 05:30/pause, trà sữa4/80, tủ/nhân viên và hai báo cáo |
| Input bảng | Sau khóa Phaser input, chọn/mua/đổi nghề, tuyển/lắp tủ và đọc báo cáo không mở NPC phía sau |
| Viewport mới | 320×568, 390×740, 430×844 có scrollWidth/scrollHeight đúng viewport; báo cáo dài cuộn nội bộ. Chỉ mô phỏng CSS, chưa thiết bị thật |
| Asset/console | Thấy quầy trà sữa màu tím/cốc trân châu và tủ cạnh quầy; không thấy lỗi game/asset trong console quan sát, log lỗi thuộc extension |
| Trang chính | URL Pages gốc tải giao diện chọn ba nghề; phiên browser này không có profile chính cũ. Việc giữ Minh của bảng lịch sử là bằng chứng đợt trước, không phải kiểm tra lại đợt này |

Ảnh báo cáo được gửi riêng trong phiên; không đưa dữ liệu tiến độ lên kho công khai. Chưa chơi cân bằng nghề nhiều tuần, đo FPS/RAM hoặc kiểm thử E2E tự động; full ca tự động đã kiểm tra bằng unit test, live trên chỉ chơi từng đoạn và kết thúc ngày sớm.
