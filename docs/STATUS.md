# Hiện trạng dự án

- Cập nhật: 30/09/2026, múi giờ Asia/Saigon.
- Mốc mã đã đối chiếu: `7fed1c563a7e3493b329c51bcbef10b98e595db5` (`feat: add neighborhood NPC stories`).
- Mức đánh giá: đọc mã và cấu trúc kho; chưa chơi thử trong phiên tạo tài liệu.
- Giai đoạn: prototype/lát cắt một quầy xôi; chưa đạt toàn bộ MVP trong PLAN.md.

## Các phần đã có trong mã

| Phần | Hiện trạng | Nguồn |
|---|---|---|
| Khởi đầu | Nhập tên, chọn 3 màu trang phục; tuổi 18 và vốn 1 triệu cố định | `WelcomeModal.tsx`, `initialState.ts` |
| Khu phố | Phaser vẽ khu Bình Minh, quầy và NPC đi ngang; 12 PNG NPC | `MainScene.ts`, `public/assets/npcs/` |
| Kinh doanh | Một quầy xôi; mua quầy, nhập hàng, mở/đóng, chỉnh giá, marketing | `gameStore.ts` |
| Bán tự động | Tick 5 phút mỗi 2 giây ở 1×; nhu cầu theo giờ, thời tiết, giá, chất lượng, uy tín, marketing | `simulation.ts`, `useGameRuntime.ts` |
| Nhân viên | Một nhân viên, công suất 2 → 5 khách/tick, lương ngày | `gameStore.ts`, `simulation.ts` |
| Thời gian | Tạm dừng, 1×/2×/4×, sang ngày mới và quyết toán | `useGameRuntime.ts`, `simulation.ts` |
| Thời tiết | Nắng, mây, mưa, nóng; hệ số nhu cầu và hiệu ứng mưa/ánh sáng | `types.ts`, `MainScene.ts` |
| Tình huống | Sinh lựa chọn NPC theo seed trong ca bán; thay đổi chỉ số và lưu lịch sử tối đa 8 tình huống | `situations.ts`, `StoryChoiceCard.tsx`, `gameStore.ts` |
| Giao diện | HUD, bảng chức năng, tutorial, thông báo; CSS khung 100dvh | `App.tsx`, `App.css` |
| Lưu game | Autosave IndexedDB mỗi 5 giây và khi tab ẩn; đang có lỗi đọc snapshot v2 | `saveDb.ts`, `useGameRuntime.ts` |
| Chat | 4 tin NPC dạng mẫu theo trạng thái; chưa có nhắn tin người thật | `GamePanel.tsx` |
| CI/CD | Workflow lint, test, build và GitHub Pages khi push main | `.github/workflows/deploy-pages.yml` |

Tên file trong bảng không ghi thư mục nằm trong các nhóm tại ARCHITECTURE.md.

## Chưa triển khai đầy đủ

- Điều khiển nhân vật đi tự do/pathfinding; NPC đi ngang là hình ảnh, không phải từng khách có mô hình nhu cầu riêng.
- Chọn giới tính/tuổi khi tạo nhân vật; nhiều ngành nghề; nhiều cơ sở/chuỗi/công ty.
- Đầu tư, vàng, chứng khoán, tài sản số, bất động sản: hiện chỉ có thẻ giao diện khóa. Mốc level hiển thị không chứng minh đã có giao dịch/mở khóa.
- Boss kinh doanh và leaderboard theo khu phố → hành tinh.
- Chat realtime, tài khoản, backend, cloud save và multiplayer.
- Offline progress, export/import, backup/recovery và hệ thống migration có kiểm thử.
- Service worker/cache offline: có manifest nhưng chưa có implementation service worker trong kho đã đối chiếu.

## Lỗi/điểm cần xử lý đã thấy khi đọc mã

| ID | Ưu tiên đề xuất | Bằng chứng và tác động |
|---|---|---|
| B01 | P0 – dữ liệu | `initialState.ts` tạo version 2, `saveGame()` ghi nguyên payload, `loadGame()` loại mọi payload.version khác 1. Save v2 sẽ bị trả null trước hydrate; autosave tiếp theo có thể ghi đè bằng tiến trình mới. Chưa tái hiện trình duyệt trong phiên này. |
| B02 | P1 – nội dung | Nhiều chuỗi trong `situations.ts` và thông báo story ở `gameStore.ts` đã chứa dấu `?` thay ký tự tiếng Việt ngay trong nguồn. Cần phục hồi nội dung UTF-8 và kiểm tra hiển thị. |
| B03 | P1 – kinh tế | `resolveSituation('serve')` áp dụng revenue/money theo số phần đặt rồi clamp inventory về 0; không kiểm tra tồn kho thực có. Có thể nhận tiền cho phần hàng thiếu. Cần test tái hiện và chặn/điều chỉnh giao dịch. |

Danh sách không phải kết quả kiểm toán toàn bộ hoặc cam kết không còn lỗi khác. Xem BACKLOG.md để thực hiện theo thứ tự.

## Bằng chứng kiểm tra

- Workflow của mốc mã trên báo `success`: [run 36689524739](https://github.com/caovanhanhtp2891-lab/khoi-nghiep-viet/actions/runs/36689524739). Đây là kết quả CI đã có, không phải kết quả chạy cục bộ của phiên tạo tài liệu.
- Kho hiện có 4 unit test mô phỏng. Các test này chưa bao phủ save/load, tình huống, UI hoặc browser.
- Cài dependency cục bộ trong phiên tạo tài liệu bị chặn truy cập npm (`EPERM`); chưa chạy lint/test/build cục bộ.
- Các tài liệu được đối chiếu mã và kiểm tra liên kết/đường dẫn. Không sửa runtime trong phiên này.

## Việc tiếp theo

Sửa B01 và thêm round-trip/migration test; xử lý B02/B03; rồi kiểm tra luồng chơi một ca và điện thoại trước khi thêm hệ thống mới. Đây là ưu tiên đề xuất, yêu cầu mới của chủ dự án có thể thay đổi thứ tự.
