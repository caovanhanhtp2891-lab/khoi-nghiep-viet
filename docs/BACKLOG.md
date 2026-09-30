# Backlog có thể bàn giao

Đối chiếu: 30/09/2026, mã `7fed1c563a7e3493b329c51bcbef10b98e595db5`.
Cập nhật Street Edition: B01–B04 đã có sửa mã và regression test; cần xem STATUS.md cho bằng chứng live. B05 chưa đối soát đầy đủ cả ngày; B06 cần hoàn tất kiểm tra mobile. F02 có chạm/phím di chuyển giới hạn vỉa hè, chưa pathfinding hoàn chỉnh; F04 có chat theo lịch/ngữ cảnh trên máy. Những phần mở rộng khác chưa làm. Ưu tiên là đề xuất từ hiện trạng, không phải xác nhận của chủ dự án về lịch phát triển.

## Sửa nền tảng trước

| ID | Việc | File bắt đầu | Tiêu chí nghiệm thu |
|---|---|---|---|
| B01 / P0 | Sửa tải snapshot v2 và tương thích v1 | `saveDb.ts`, `gameStore.ts`, `types.ts` | Save v2 → load giữ nguyên dữ liệu; fixture v1 thật được chuyển sang v2 có story mặc định; bản hỏng/không hỗ trợ không bị ghi đè âm thầm; có test round-trip và reload browser |
| B02 / P1 | Phục hồi dấu tiếng Việt của story | `situations.ts`, `gameStore.ts` | Nội dung, tên, lựa chọn và icon không còn dấu hỏi thay chữ; UTF-8 trên GitHub và điện thoại; rà soát cả thông báo |
| B03 / P1 | Chặn bán thiếu hàng trong lựa chọn NPC | `gameStore.ts`, `situations.ts` | Test tồn kho 0, nhỏ hơn, bằng, lớn hơn đơn đặt; tiền/doanh thu/giá vốn/khách khớp số hàng thực; bấm lặp không nhận tiền lần hai |
| B04 / P1 | Kiểm tra đúng seed trả về sau sinh choices | `situations.ts` | Seed trả về phản ánh trạng thái RNG sau mọi lần rút số; cùng seed/context cho cùng kết quả; tick tiếp nối có test. Hiện seed kết quả được đọc trước `makeChoices()` còn tiếp tục đổi seed |
| B05 / P1 | Kiểm tra luồng một ca bán | domain/store/UI | Đối soát tiền đầu–cuối, nhập hàng, marketing, tuyển dụng, chi phí sang ngày; pause/speed không nhân đôi giao dịch; có bằng chứng test và chơi thử |
| B06 / P1 | Kiểm tra mobile và lifecycle | `App.css`, `GameCanvas.tsx`, `MainScene.ts` | 320/360/390/430 px dùng được; không cuộn cả trang; bảng cuộn nội bộ; resize không nhân đôi timer/event; PNG load đúng trên đường dẫn GitHub Pages |

## Mở rộng sau khi nền tảng ổn định

| ID | Việc | Phụ thuộc | Tiêu chí nghiệm thu |
|---|---|---|---|
| F01 | Backup/export/import và recovery save | B01 | Xuất–nhập round-trip; validate schema; không mất dữ liệu khi input lỗi; có đường khôi phục và test |
| F02 | Điều khiển nhân vật di chuyển | B06, chốt cách điều khiển | Chạm để đi hoặc joystick được chốt; không xuyên vật cản; resize đúng; quyết định lưu vị trí được ghi rõ |
| F03 | Cấu hình nhiều nghề | B05 | Thêm một nghề bằng dữ liệu; giờ bán/nhu cầu/chi phí khác nhau; UI không hard-code tên xôi; test chuyển/giữ save |
| F04 | NPC chat theo lịch và sự kiện | B02 | Tin mới theo game time/thời tiết/sự kiện; có giới hạn lịch sử; phân biệt bot; chưa giả làm chat realtime |
| F05 | Boss và bảng xếp hạng offline | F03 | Đối thủ dùng cùng quy tắc economy; cách tính tài sản được ghi rõ và test; UI nêu phạm vi offline |
| F06 | Offline progress | B01, B05 | Giới hạn thời gian được chốt; nhập lại không nhận tiền hai lần; báo cáo đối soát; xử lý chỉnh giờ |
| F07 | PWA offline thật | B01, B06 | Service worker/update policy; mở offline sau lần tải đầu; asset cache đúng base path; upgrade không mất save |

Đầu tư, chuỗi công ty và online world xem PLAN.md mục 15, 26, 35, 38 và 45; chỉ chia task khi chủ dự án yêu cầu hoặc đủ điều kiện nền tảng.

## Mẫu task mới

- ID / trạng thái / ưu tiên:
- Giá trị cho người chơi:
- Phạm vi và file liên quan:
- Phụ thuộc, câu hỏi còn mở:
- Tiêu chí hoàn thành có thể kiểm tra:
- Ảnh hưởng dữ liệu cũ:
- Kết quả kiểm tra + commit/PR khi hoàn thành:

## Ưu tiên sau Street Edition

- Kiểm tra live và mobile thực tế; bổ sung E2E khi có hạ tầng browser test.
- Pathfinding quanh xe xôi, đa dạng sprite nghề/tuổi và animation hướng đi.
- Backup nhiều phiên/import, khóa save giữa nhiều tab.
- Tách cấu hình nghề và cân bằng quyết toán trước thêm ngành.
- Bundle Phaser hiện lớn; đo tải, FPS và bộ nhớ trên điện thoại.

## 100 cư dân và mở rộng khu phố

- Hoàn thành: 100 NPC riêng/50 nghề hoặc vai trò, sổ cư dân/filter, quan hệ lưu được, 3 đơn đề nghị/ngày, 8 milestone, 3 upgrade quầy; xem NPC_SYSTEM.md.
- Tiếp theo: hình upgrade xuất hiện trên xe xôi, cây hội thoại và lịch đi làm/đi học theo từng NPC (hiện roster theo ngày/giờ chung), dẫn đường giao đơn, lưu nhiều tab, thêm nghề kinh doanh sau cân bằng một ca/ngày.
- Đã có tránh xe xôi cho chạm để đi; chưa phải pathfinding bản đồ tổng quát. Không tự đánh dấu F02/B06 hoàn tất cho thiết bị thật.
