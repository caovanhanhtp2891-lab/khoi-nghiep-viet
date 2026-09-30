# Khởi Nghiệp Việt

Web game mô phỏng kinh doanh 2D tại Việt Nam. Người chơi bắt đầu ở tuổi 18 với 1.000.000 VNĐ, mở quầy đầu tiên, phục vụ khách NPC và phát triển sự nghiệp kinh doanh.

## Chạy trên máy

Yêu cầu Node.js 24+ và pnpm 11+.

```bash
pnpm install
pnpm dev
```

Mở địa chỉ Vite hiển thị trong terminal.

## Kiểm tra bản production

```bash
pnpm lint
pnpm test
pnpm build
pnpm preview
```

## Đưa lên GitHub Pages

1. Tạo một repository GitHub và đẩy nhánh `main` lên đó.
2. Vào **Settings → Pages → Build and deployment**.
3. Chọn nguồn **GitHub Actions**.
4. Workflow `.github/workflows/deploy-pages.yml` sẽ tự kiểm thử, build và phát hành game sau mỗi lần push lên `main`.

Chi tiết thiết kế và lộ trình dài hạn nằm trong [PLAN.md](./PLAN.md).

## Tiếp nhận dự án và phát triển bằng AI

Bắt đầu từ [AGENTS.md](AGENTS.md), sau đó đọc [hiện trạng](docs/STATUS.md), [kiến trúc](docs/ARCHITECTURE.md) và [bàn giao](docs/HANDOFF.md). Danh sách đầy đủ nằm ở [docs/README.md](docs/README.md).

[PLAN.md](PLAN.md) mô tả thiết kế và lộ trình dài hạn; trạng thái đã triển khai thực tế nằm ở [STATUS.md](docs/STATUS.md). Street Edition đã sửa loader v2 và chuyển payload mới sang v3. Xem [hiện trạng](docs/STATUS.md) để biết kết quả kiểm tra và phần còn thiếu.

## Street Edition

Chọn nhân vật nam/nữ, chạm vỉa hè để đi (máy tính dùng phím mũi tên), chạm quầy để quản lý và chạm NPC để nghe lời thoại. Chat khu phố hiện là hội thoại local với NPC, chưa có người chơi online. Thông báo tự ẩn sau 1 giây; tình huống lựa chọn được giữ tới khi xử lý.

Để thử tạo nhân vật mới mà giữ tiến độ chính, thêm `?demo=1` vào URL game. Hồ sơ chơi thử được lưu riêng.
