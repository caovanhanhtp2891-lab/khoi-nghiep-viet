# Backlog có thể bàn giao

Đối chiếu: 30/09/2026, mã `d131043b17d7842ea171da06c8fde0523182d2bb`.
Cập nhật Street Edition: B01–B04 đã có sửa mã và regression test; cần xem STATUS.md cho bằng chứng live. B05 đã đối soát full ca bằng test và hai quyết toán ngày live; còn cân bằng dài hạn; B06 đã kiểm tra viewport CSS 320/360/390/430, còn thiết bị thật/lifecycle đầy đủ. F02 có chạm/phím di chuyển giới hạn vỉa hè, chưa pathfinding hoàn chỉnh; F04 có chat theo lịch/ngữ cảnh trên máy. F05 đã thêm ba đối thủ/xếp hạng/thi đua cục bộ; các phần mở rộng khác xem dưới. Ưu tiên là đề xuất từ hiện trạng, không phải xác nhận của chủ dự án về lịch phát triển.

## Sửa nền tảng trước

| ID | Việc | File bắt đầu | Tiêu chí nghiệm thu |
|---|---|---|---|
| B01 / P0 | Sửa tải snapshot v2 và tương thích v1 | `saveDb.ts`, `gameStore.ts`, `types.ts` | Save v2 → load giữ nguyên dữ liệu; fixture v1 được chuyển sang v4 có story mặc định; bản hỏng/không hỗ trợ không bị ghi đè âm thầm; có test round-trip và reload browser |
| B02 / P1 | Phục hồi dấu tiếng Việt của story | `situations.ts`, `gameStore.ts` | Nội dung, tên, lựa chọn và icon không còn dấu hỏi thay chữ; UTF-8 trên GitHub và điện thoại; rà soát cả thông báo |
| B03 / P1 | Chặn bán thiếu hàng trong lựa chọn NPC | `gameStore.ts`, `situations.ts` | Test tồn kho 0, nhỏ hơn, bằng, lớn hơn đơn đặt; tiền/doanh thu/giá vốn/khách khớp số hàng thực; bấm lặp không nhận tiền lần hai |
| B04 / P1 | Kiểm tra đúng seed trả về sau sinh choices | `situations.ts` | Seed trả về phản ánh trạng thái RNG sau mọi lần rút số; cùng seed/context cho cùng kết quả; tick tiếp nối có test. Lỗi lịch sử đọc seed trước `makeChoices()` đã sửa, regression test thành công |
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

- Kiểm tra thiết bị mobile thật; bổ sung E2E khi có hạ tầng browser test.
- Đã tránh xe xôi cho chạm để đi và có 100 NPC nghề/tuổi; tiếp tục pathfinding rộng và animation hướng đi.
- Backup nhiều phiên/import, khóa save giữa nhiều tab.
- Đã tách cấu hình ba nghề và quyết toán; cân bằng nhiều ngày trước thêm ngành.
- Bundle Phaser hiện lớn; đo tải, FPS và bộ nhớ trên điện thoại.

## 100 cư dân và mở rộng khu phố

- Hoàn thành: 100 NPC riêng/50 nghề hoặc vai trò, sổ cư dân/filter, quan hệ lưu được, 3 đơn đề nghị/ngày, 8 milestone, 3 upgrade quầy; xem NPC_SYSTEM.md.
- Hình upgrade đã hiện trên quầy; tiếp theo: cây hội thoại và lịch đi làm/đi học theo từng NPC (hiện roster theo ngày/giờ chung), dẫn đường giao đơn, lưu nhiều tab, cân bằng ba nghề hiện có trước mở rộng kinh doanh.
- Đã có tránh xe xôi cho chạm để đi; chưa phải pathfinding bản đồ tổng quát. Không tự đánh dấu F02/B06 hoàn tất cho thiết bị thật.

## Ba nghề và report

- F03: đã tách careers.ts, ba lựa chọn xôi/bánh mì/trà sữa trên một quầy, giờ/chi phí/công suất/nhu cầu khác nhau; có regression test và migration v5. Không phải ba quầy cùng lúc.
- B05: thêm full-ca test đối soát restock/marketing/tuyển/thưởng/thuê/lương và report; live cuối xem STATUS.md. Chưa cân bằng dài hạn nhiều nghề.
- Upgrade visual đã có trên cảnh; tiếp tục đo hiệu năng thiết bị thật, save nhiều tab, lịch NPC cá nhân và mô hình nhiều quầy.


## Đua top cục bộ

F05 đã có ba đối thủ dùng simulateTick chung với ngân sách/stock/fees, bảng assets/revenue/profit, thi đua theo baseline và thưởng một lần, tin chat state thật. 57 test/7 file gồm regression economy/save; live cuối xem STATUS.md. Chưa bảng tỉnh/quốc gia/thế giới, multiplayer hoặc AI học từ lịch sử. Tiếp tục cân bằng độ khó nhiều ngày và dự trữ vốn để người chơi có thể cạnh tranh bằng thao tác trên mobile.

## UI và hội thoại mở rộng

Đã có 120 cư dân/60 nghề, sáu loại phương tiện, bộ 1.000 biến thể từ 50 tình huống, chọn người nhận/chat gợi ý, NPC hỏi đáp và filter Quen biết. Header/composer không cuộn; tab quay đầu; chi tiết vận hành gập. 64 test/8 file và generator120; nghiệm thu live cuối ở STATUS.md.

Ưu tiên tiếp: cân bằng NPC qua nhiều ngày và tự nhập hàng có giới hạn cho người chơi; đo FPS/RAM trên máy thật; save lock nhiều tab; cây hội thoại có trí nhớ dài hạn. Muốn thêm 20 cư dân mới vào đơn phải version hóa pool/offer để giữ đơn đang nhận từ save cũ.
