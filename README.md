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

[PLAN.md](PLAN.md) mô tả thiết kế và lộ trình dài hạn; trạng thái đã triển khai thực tế nằm ở [STATUS.md](docs/STATUS.md). Street Edition sửa loader v2; bản nhiều nghề dùng payload v6 tương thích v1–v5. Xem [hiện trạng](docs/STATUS.md) để biết kết quả kiểm tra và phần còn thiếu.

## Street Edition

Chọn nhân vật nam/nữ, chạm vỉa hè để đi (máy tính dùng phím mũi tên), chạm quầy để quản lý và chạm NPC để nghe lời thoại. Chat khu phố hiện là hội thoại local với NPC, chưa có người chơi online. Thông báo tự ẩn sau 1 giây; tình huống lựa chọn được giữ tới khi xử lý.

Để thử tạo nhân vật mới mà giữ tiến độ chính, thêm `?demo=1` vào URL game. Hồ sơ chơi thử được lưu riêng.

## Khu phố 120 cư dân

Sổ **Cư dân** có 120 NPC hư cấu, 60 nghề/vai trò, độ tuổi 7–82. Mỗi người có sprite SVG riêng gồm 4 frame đi bộ; không dùng sprite người chơi. Chạm NPC hoặc mở sổ để xem hồ sơ, chào hỏi, hỏi chuyện nghề và tăng tình thân một lần/ngày.

Trong Cư dân có **Đơn đặt** (3 đề nghị/ngày, một đơn đang nhận, hạn 120 phút game) và **Nhiệm vụ** (8 mốc thưởng một lần). Quản lý **Kinh doanh** có 3 nâng cấp: mái che, tủ nguyên liệu và biển hiệu. Tiến độ được lưu trong payload v6, giữ tiến độ v1–v5.

Chỉnh dữ liệu/ngoại hình NPC tại `src/domain/npcCatalog.ts` và `src/domain/npcArt.ts`, rồi chạy `pnpm assets:npcs`. `pnpm test` kiểm tra cả 120 asset khớp generator trước khi chạy unit test. Chi tiết xem [NPC_SYSTEM.md](docs/NPC_SYSTEM.md).

## Ba nghề và báo cáo ngày

Trong **Kinh doanh → Nghề**, chọn xôi, bánh mì hoặc trà sữa; mỗi nghề có vốn, ca bán, nhu cầu và công suất riêng. Đổi nghề có bảng thu hồi dụng cụ/hàng cũ, giữ nhân viên và nâng cấp; cần đóng quầy và xử lý đơn/tình huống đang chờ.

**Kinh doanh → Báo cáo** lưu 30 ngày, tách lời lỗ khỏi dòng tiền. Có nút kết thúc ngày sớm, quyết toán phí và sang 05:30 hôm sau. Quầy trên phố đổi sản phẩm/biển và hiển thị nâng cấp đã mua. Xem [BUSINESS_SYSTEM.md](docs/BUSINESS_SYSTEM.md).

## Đua top khu phố

Mở **Cư dân → Đua top** để so tài sản, doanh thu và lợi nhuận với Chú Sáu, Anh Tài và Trâm. NPC tự nhập hàng/marketing/tuyển người với chi phí thật trong game và bán theo công thức chung. Nhận thi đua cùng nghề, phục vụ ít nhất 10 sản phẩm và vượt lợi nhuận đối thủ khi quyết toán để nhận 50.000đ +60 XP một lần.

Bảng và đối thủ chạy cục bộ, không có người chơi online. Save cũ tham gia thi đua từ ngày tiếp theo; tiến độ cũ giữ nguyên. Xem [COMPETITION_SYSTEM.md](docs/COMPETITION_SYSTEM.md).

## Hội thoại và giao lưu

Chat có 1.000 lời thoại từ 50 tình huống, NPC hỏi/đáp với nhau, chọn người nhận và gợi ý trò chuyện. Sổ có **Quen biết**: chỉ chào hỏi, chat trực tiếp hoặc giao đơn mới tăng quan hệ; xem hồ sơ không tính. Thêm công an, dân quân, cảnh sát giao thông, cứu hỏa và nhiều nghề; sáu loại phương tiện đi hai chiều. Bảng dài cuộn nội bộ, ô nhập chat giữ ở cuối và phần nhu cầu/nâng cấp có thể gập. Xem [DIALOGUE_SYSTEM.md](docs/DIALOGUE_SYSTEM.md).
