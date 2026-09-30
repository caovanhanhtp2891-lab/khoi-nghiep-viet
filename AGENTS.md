# Hướng dẫn AI làm việc với Khởi Nghiệp Việt

## Bắt đầu mỗi phiên

1. Đọc `README.md`, `docs/STATUS.md`, `docs/ARCHITECTURE.md`.
2. Đọc `docs/BACKLOG.md` và `docs/HANDOFF.md` để biết ưu tiên và điểm tiếp tục.
3. Đọc tài liệu chuyên đề liên quan trước khi sửa: save → `docs/SAVE_FORMAT.md`; kiểm thử → `docs/TESTING.md`; hình ảnh → `docs/ASSETS.md`.
4. Đọc phần liên quan trong `PLAN.md` để hiểu mục tiêu dài hạn. Đây là kế hoạch, không phải danh sách tính năng đã hoàn thành.
5. Kiểm tra nhánh, commit hiện tại, thay đổi chưa commit và các `AGENTS.md` ở thư mục con nếu có. Không ghi đè công việc của người khác.

## Cách xác định sự thật

- Yêu cầu mới nhất của chủ dự án quyết định phạm vi công việc.
- Mã tại commit đang làm việc xác định hành vi hiện tại. Nếu tài liệu khác mã, kiểm tra rồi cập nhật tài liệu và nêu chênh lệch.
- `STATUS.md` ghi hiện trạng; `BACKLOG.md` ghi việc đề xuất; `PLAN.md` ghi tầm nhìn. Không coi giao diện bị khóa hoặc đoạn chat mẫu là hệ thống đã triển khai.
- Phân biệt rõ: đọc mã, tái hiện thực tế, kiểm thử thành công, chưa kiểm tra. Không tuyên bố kiểm thử nếu chưa chạy.

## Định hướng phải giữ

- Game kinh doanh 2D bối cảnh Việt Nam, tiếng Việt, ưu tiên điện thoại.
- Khởi đầu 18 tuổi, 1.000.000 VNĐ; thời gian mặc định 2 giây thực = 5 phút game tại tốc độ 1×.
- Bán hàng vận hành theo mô phỏng thời gian, nhu cầu, tồn kho và công suất. Không tạo nút bấm cộng tiền vô hạn.
- Giữ khung chính gọn trong màn hình; nội dung dài cuộn bên trong bảng chức năng.
- Lưu tiến độ phải tương thích dữ liệu cũ. Không xóa save để né lỗi migration.
- Các quyết định chưa chốt xem `docs/DECISIONS.md`; không tự biến kế hoạch thành tính năng hoàn thành.

## Ranh giới mã

- `src/domain/`: dữ liệu, công thức và mô phỏng; tránh phụ thuộc React, Phaser, DOM hay đồng hồ thật.
- `src/store/`: actions và trạng thái Zustand; chỉ xuất snapshot dữ liệu để lưu.
- `src/game/`: hiển thị Phaser; hiệu ứng không được trực tiếp quyết định doanh thu/tồn kho.
- `src/components/` và `src/App.tsx`: giao diện React, gọi actions để đổi trạng thái.
- `src/hooks/useGameRuntime.ts`: điều phối load, tick, autosave.
- `src/services/saveDb.ts`: truy cập IndexedDB, cần đồng bộ với phiên bản snapshot.
- Giữ TypeScript, pnpm và lockfile hiện có; không đổi stack hoặc nâng dependency ngoài phạm vi công việc.
- Ngẫu nhiên kinh tế dùng seed; `Math.random()` trong scene chỉ dành cho hình ảnh.
- Giữ UTF-8 và dấu tiếng Việt. Không đưa khóa API, dữ liệu tài khoản hoặc file build vào Git.

## Kiểm tra theo thay đổi

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
```

Node.js 24+, pnpm 11+ theo README và CI hiện tại. `pnpm build` bao gồm TypeScript qua `tsc -b`.

- Đổi logic/save: thêm kiểm thử hành vi có giá trị; save cần round-trip và dữ liệu cũ.
- Đổi UI/Phaser: kiểm tra màn hình điện thoại, resize, thao tác chạm, asset và console.
- Chỉ đổi tài liệu: kiểm tra đường dẫn, liên kết và tính đúng với mã; không cần thêm test mô phỏng hình thức.
- Khi môi trường không chạy được lệnh, ghi nguyên nhân và trạng thái chưa kiểm tra; không đổi lockfile để né lỗi môi trường.

## Kết thúc mỗi phiên

1. Cập nhật `docs/STATUS.md`: thay đổi, bằng chứng kiểm tra, giới hạn còn lại, mốc commit mã đã đối chiếu.
2. Cập nhật `docs/BACKLOG.md`: chỉ đánh dấu xong khi đạt tiêu chí nghiệm thu.
3. Cập nhật `docs/HANDOFF.md`: việc tiếp theo cụ thể, file liên quan và kiểm tra cần làm.
4. Đổi cấu trúc/schema/quyết định thì cập nhật tài liệu tương ứng; ghi thay đổi đáng kể vào `CHANGELOG.md`.
5. Xem diff để loại sửa ngoài phạm vi. Chỉ push, merge hoặc triển khai theo yêu cầu/quyền đã được chủ dự án cấp; không force-push hoặc ghi đè lịch sử để vượt xung đột.
6. Báo cáo ngắn gọn kết quả, kiểm tra đã chạy, lỗi còn lại và commit/PR nếu có.
