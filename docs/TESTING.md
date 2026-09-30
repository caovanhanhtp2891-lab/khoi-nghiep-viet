# Kiểm thử và xác nhận chất lượng

## Lệnh hiện có

Yêu cầu Node.js 24+, pnpm 11+. Dùng phiên bản/lockfile của kho.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
pnpm dev
```

`pnpm build` chạy `tsc -b` và Vite. Kiểm tra bundle production bằng `pnpm preview` sau khi build. `pnpm test:watch` có sẵn cho phát triển.

CI hiện chạy lint/test/build trước deploy Pages trên push main hoặc workflow_dispatch. Chưa có trigger pull_request trong workflow đối chiếu. Không mặc định PR đã được kiểm tra nếu không có run tương ứng.

## Phạm vi tự động đang có

`src/domain/simulation.test.ts` có 4 test: cùng seed/state cho cùng kết quả; giới hạn tồn kho/công suất; mưa giảm nhu cầu; RNG nhất quán.
`vite.config.ts` chạy test `src/**/*.test.ts` trong môi trường `node`. Đợt Street Edition thêm test Dexie round-trip/migration/backup, store giao dịch story, gender/vị trí/chat và seed story; đợt đó có 15 test trong 4 file; bản 100 cư dân có 25 test/5 file; bản ba nghề hiện có 42 test/6 file. Chưa có test React hoặc E2E browser. `saveDb.test.ts` dùng fake-indexeddb/auto.

Kết quả test mô phỏng thành công không chứng minh save/load hoặc UI chạy đúng. Khi sửa nghiệp vụ hãy test hành vi và các ranh giới; không test chỉ để lặp lại cấu trúc implementation.

## Kịch bản chơi thử

Dùng profile/dữ liệu thử; giữ bản sao save cần bảo toàn. B01 đã sửa trong đợt Street Edition; reload test cần giữ đúng tiến độ.

| Kịch bản | Kết quả cần kiểm tra |
|---|---|
| Lần vào đầu | Loading kết thúc; nhập tên và chọn màu; tuổi 18/vốn 1 triệu |
| Mở quầy | Xôi 480.000/bánh mì 600.000/trà sữa 800.000; nhận 20 sản phẩm; không mua hai lần |
| Mở bán trong ca | Tồn kho giảm và tiền tăng theo tick; không cần nút bán cộng tiền |
| Pause/1×/2×/4× | Pause dừng nghiệp vụ; 1× khoảng 2 giây/5 phút khi tab active; đổi tốc độ không sinh tick trùng |
| Giá/marketing | Hệ số nhu cầu thay đổi; tiền marketing trừ đúng |
| Hết hàng/nhập hàng | Không tồn kho âm; nhập tối đa 20 hoặc phần chỗ còn trống; số dư đủ cho cả lượng nhập |
| Thuê nhân viên | Phí 70.000 một lần; công suất xôi/trà sữa 5, bánh mì 7/tick; lương 120.000/ngày theo quyết toán |
| Cuối ca/ngày mới | Xôi 10:00, bánh mì 14:00, trà sữa 22:00 tự đóng; quyết toán tiền thuê/lương, thống kê ngày mới |
| Tình huống | Lựa chọn áp dụng một lần; không bán quá hàng, không dùng tiền thiếu; lịch sử giữ tối đa 8 |
| Reload | Sau autosave giữ tên, tiền, hàng, thời gian, seed và story; so sánh dữ liệu trước và sau tải lại |
| Chat/đầu tư | Nhận diện chat NPC local và đầu tư khóa; không tuyên bố chức năng chưa có đã chạy |
| Asset và Phaser | Nền/atlas và 100 SVG NPC không 404; chạm quầy mở bảng; resize không nhân đôi listener/NPC timer |
| Mobile | Rộng 320/360/390/430 px; màn hình ngắn; bàn phím nhập tên; safe area; bảng cuộn nội bộ |
| Lifecycle | Chuyển tab, quay lại, unmount/remount; không crash hoặc tăng tiền hai lần |

Viewport là giả lập; trước release cần ghi trình duyệt và thiết bị thật được kiểm tra. Kiểm tra build production tại đường dẫn con Pages để phát hiện asset URL sai.

## Kiểm tra tài liệu

- Link Markdown tương đối trỏ tới file có thật trong kho.
- Đường dẫn module và lệnh khớp mã hiện tại.
- Trạng thái đã làm/chưa làm có bằng chứng; điểm chưa thử được ghi rõ.
- UTF-8, không lộ dữ liệu riêng tư, không thêm thay đổi runtime ngoài phạm vi.

## Mẫu ghi kết quả

```text
Ngày / múi giờ:
Commit mã được kiểm tra:
Môi trường / trình duyệt / viewport:
Lệnh và exit code:
Kịch bản chơi thử + kết quả:
Phần chưa kiểm tra / nguyên nhân:
Lỗi còn lại / việc tiếp theo:
```

Bằng chứng hiện tại và giới hạn của phiên tạo tài liệu nằm ở STATUS.md.

Street Edition đã chạy thành công lint, 15 unit test và build cục bộ; kiểm tra live và giới hạn thiết bị xem STATUS.md.

Có trang `mobile-preview.html` để đặt iframe game demo ở 320/360/390/430 px và chiều cao 568/640/740/844 px. Đây là kiểm tra viewport CSS trên desktop, không thay cho benchmark thiết bị thật.

## Đợt 100 cư dân

`pnpm test` kiểm tra 100 sheet SVG đúng generator rồi chạy **25 test/5 file**. `neighborhood.test.ts` kiểm tra identity/ngoại hình riêng (bỏ title trước so uniqueness), roster deterministic, chào hỏi không farm XP trong cùng ngày, reward một lần, đơn đủ/thiếu/quá hạn/id sai, nâng cấp chỉ mua một lần, đối soát doanh thu/kho/giá vốn và migration v3/v4. Test Dexie đã thêm quan hệ/upgrade/milestone trong round-trip.

Kịch bản live bổ sung: filter theo nghề/tuổi, gặp NPC → hồ sơ, chào/hỏi nghề → chat/quan hệ, nhận đơn/giao, nhận thưởng, mua nâng cấp; pause và reload giữ tiến độ. Kiểm tra viewport qua mobile-preview là CSS iframe, không phải emulation phần cứng hay benchmark.

## Ba nghề và quyết toán

42 test/6 file. careers.test.ts bao phủ ca/thời tiết theo nghề, chuyển nghề và hoàn vốn, chặn active order/trading, milk tea order, full ca xôi đối soát dòng tiền, phí một lần, finishDay giữ pause, report 30 ngày, v4 thật →v5, round-trip Dexie và payload hỏng. Live thử đổi nghề, nhân viên/nâng cấp giữ, quầy đổi hình, bán theo tick, kết thúc ngày, report và reload; xem STATUS.md.

Regression live: bản v4 phải đi qua load/hydrate rồi lưu v5 và reload mà không bị recovery. Khi bảng mở, Phaser pointer phải bị khóa; chọn nghề/đóng bảng không mở hồ sơ NPC phía sau.


## Đối thủ và thi đua

57 test/7 file +check 100 SVG. competition.test.ts kiểm tra vốn/chi phí/rank/tie/RNG, cả ngày với restock/staff/upgrade/fee đối soát, pause và finishDay không thêm player sales, enroll baseline/chặn đổi nghề, thắng/thua/claim một lần, genuine v5 trà sữa +order/report/upgrade/cashOpening=null, corrupted competition giữ raw và continuation sau Dexie load/hydrate. Kịch bản live: mở Đua top, đổi tiêu chí, xem ledger/tin NPC, nhận thi đua đúng ngày, chơi một đoạn, quyết toán, reload giữ hạng/challenge/result/seed. Chỉ ghi kết quả thực tế trong STATUS.md.

## Bản hội thoại và UI gọn

64 test/8 file +120 SVG. dialogue.test.ts kiểm tra 1.000 văn bản duy nhất/50 tình huống, nhận từ khóa không nhầm mua/mưa hoặc tôi/tối, rain selector/seed, cặp NPC khác nhau, quan sát không tạo quan hệ, chat và chào chỉ một lượt thưởng/ngày kể cả reload, không trả tiền chat, giới hạn 160 ký tự/40 tin, đơn cũ ở ngày lớn và IDs mới. UI cần kiểm tra ở 320×568, 390×740, 430×844: scroll tới dòng cuối, quay tab về đầu, gập/mở vận hành, chat composer luôn thấy, xem hồ sơ không thêm người quen, gửi/chào thêm đúng một người, reload giữ kết quả.
