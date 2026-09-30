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

[PLAN.md](PLAN.md) mô tả thiết kế và lộ trình dài hạn; trạng thái đã triển khai thực tế nằm ở [STATUS.md](docs/STATUS.md). Bản mã đã đối chiếu hiện có lỗi tải save version 2; xem mục B01 trong [backlog](docs/BACKLOG.md) trước khi mở rộng tính năng.
