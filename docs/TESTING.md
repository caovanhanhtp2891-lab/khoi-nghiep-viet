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
`vite.config.ts` chạy test `src/**/*.test.ts` trong môi trường `node`. Đợt Street Edition thêm test Dexie round-trip/migration/backup, store giao dịch story, gender/vị trí/chat và seed story; tổng 15 test trong 4 file. Chưa có test React hoặc E2E browser. `saveDb.test.ts` dùng fake-indexeddb/auto.

Kết quả test mô phỏng thành công không chứng minh save/load hoặc UI chạy đúng. Khi sửa nghiệp vụ hãy test hành vi và các ranh giới; không test chỉ để lặp lại cấu trúc implementation.

## Kịch bản chơi thử

Dùng profile/dữ liệu thử; giữ bản sao save cần bảo toàn. B01 đã sửa trong đợt Street Edition; reload test cần giữ đúng tiến độ.

| Kịch bản | Kết quả cần kiểm tra |
|---|---|
| Lần vào đầu | Loading kết thúc; nhập tên và chọn màu; tuổi 18/vốn 1 triệu |
| Mở quầy | Trừ 480.000 VNĐ, nhận 20 phần; không mua hai lần |
| Mở bán trong ca | Tồn kho giảm và tiền tăng theo tick; không cần nút bán cộng tiền |
| Pause/1×/2×/4× | Pause dừng nghiệp vụ; 1× khoảng 2 giây/5 phút khi tab active; đổi tốc độ không sinh tick trùng |
| Giá/marketing | Hệ số nhu cầu thay đổi; tiền marketing trừ đúng |
| Hết hàng/nhập hàng | Không tồn kho âm; nhập tối đa 20 hoặc phần chỗ còn trống; số dư đủ cho cả lượng nhập |
| Thuê nhân viên | Phí 70.000 một lần; công suất 5/tick; lương 120.000/ngày theo quyết toán |
| Cuối ca/ngày mới | 10:00 tự đóng; quyết toán tiền thuê/lương, thống kê ngày mới |
| Tình huống | Lựa chọn áp dụng một lần; không bán quá hàng, không dùng tiền thiếu; lịch sử giữ tối đa 8 |
| Reload | Sau autosave giữ tên, tiền, hàng, thời gian, seed và story; so sánh dữ liệu trước và sau tải lại |
| Chat/đầu tư | Nhận diện phần mẫu/khóa; không tuyên bố chức năng chưa có đã chạy |
| PNG và Phaser | 12 asset không 404; chạm quầy mở bảng; resize không nhân đôi listener/NPC timer |
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
