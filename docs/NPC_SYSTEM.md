# Hệ thống cư dân và nhiệm vụ

Cập nhật 30/09/2026. Dữ liệu hư cấu, không đại diện người thật. Phát triển tiếp từ `f276023081d5739d33e70b93d99eee5fb42dc66f`.

## 120 NPC

`npcCatalog.ts` chứa 120 tên/tuổi/giới tính được khai báo riêng, 60 nghề hoặc vai trò, 10 nhóm. 60 nam, 60 nữ; tuổi 7–82. Các vai trò trẻ em chỉ là học sinh; không có lao động trẻ em. `streetNpc()` luân phiên theo ngày/giờ và sequence, không rút RNG kinh tế. Ban đêm không chọn cư dân dưới 18. Scene hiển thị tối đa 10 NPC, không vẽ đồng thời cả 120.

`npcArt.ts` là renderer vector gốc của kho: mặt, tóc, kính, nếp nhăn, đồng phục, mũ và vật dụng nghề. Không dùng atlas nam/nữ người chơi. `scripts/generate-npcs.mjs` tạo 120 SVG tại `public/assets/npcs-v2/npc-001.svg` đến `npc-120.svg`, mỗi sheet 480×200, 4 frame 120×200. Source SVG tự có title tiếng Việt, không phụ thuộc font để hiển thị mặt/đồ nghề.

```bash
pnpm assets:npcs
pnpm test
```

`pnpm test` chạy generator `--check` để phát hiện asset lệch catalog/renderer. Phaser preload SVG, thêm frame và animation 6fps; React `NpcPortrait` dùng cùng SVG với background-size 400% 100%. Cả hai dùng BASE_URL của Vite. Trẻ em thu nhỏ; người cao tuổi đi chậm hơn. NPC luôn có nghề/tuổi rõ trong sổ; một số nghề cùng loại đồng phục/vật dụng nhưng phối màu/tóc/mặt khác nhau.

## Quan hệ

Chào hỏi/hỏi chuyện nghề tạo tin nhắn có npcId, tối đa 40 tin. Lần trò chuyện đầu với một NPC trong ngày tăng 3 tình thân +3 XP; bấm lặp không tăng tiếp. Quan hệ gồm bond 0–100, greetedDay, meetings. Giao đơn tăng 8 tình thân và 15 XP. Các nhãn: đã làm quen, quen thuộc từ 25, thân thiết từ 60. Chưa có AI ngôn ngữ, cây hội thoại phân nhánh hay người chơi online.

## Đơn đặt

`dailyOrders(day)` tạo đúng 3 đề nghị cho cư dân trưởng thành theo lịch xác định; không phụ thuộc RNG kinh tế hay giá quầy. Mỗi đơn 3–6 sản phẩm, giá lấy theo nghề (giá cấu hình −2.000/0/+2.000); một đơn đang nhận. Nhận đơn lưu giá/số lượng/người nhận và thời hạn 120 phút game. Phải giao cùng ngày và không muộn hơn deadline. Đơn quá hạn giữ trên UI tới khi hủy để người chơi biết lý do.

Giao đơn là một action giao dịch: đủ hàng → trừ kho, cộng tiền/doanh thu, tăng giá vốn theo unitCost và customers theo số phần, lưu completed id, xóa active. Bấm giao lặp hoặc nhận lại id đã hoàn thành cùng ngày không trả tiền lần hai. completedOrders giữ 60 id gần nhất; chỉ nhận id thuộc ngày hiện tại. Hủy không mất tiền; có thể nhận lại đề nghị chưa hoàn thành. Đây là thao tác giao trọn đơn từ quầy, chưa có lộ trình đi giao hàng trên bản đồ.

## Mốc hành trình và nâng cấp

8 milestone khai báo trong `neighborhood.ts`; reward tiền/XP chỉ nhận một lần, kiểm tra lại tiến độ trong store. Reward là hỗ trợ từ khu phố, không cộng vào doanh thu bán hàng.

| Nâng cấp | Giá | Hiệu quả |
|---|---:|---|
| Mái che mở rộng | 90.000 | Nhu cầu ngày mưa đạt ít nhất 0,78 |
| Tủ nguyên liệu | 140.000 | maxInventory +30, không tự thêm hàng |
| Biển hiệu | 100.000 | Hệ số marketing +0,15 cố định |

Mỗi nâng cấp mua một lần, cần quầy và đủ tiền; chi phí ghi vào dayStats.expenses. Scene đã có visual upgrade. Economy có một quầy với ba lựa chọn nghề và một nhân viên; xem BUSINESS_SYSTEM.md.

## Save v4

`neighborhood` chứa relationships, activeOrder, completedOrders, deliveries, upgrades, claimedMilestones. `snapshotFromStore()` phải xuất nhóm này. v1–v3 thêm defaults, giữ economy/gender/position/chat có sẵn. v4 validate NPC id, số bond, milestone/upgrade id, giá/số lượng đơn theo đề nghị gốc; payload không hợp lệ → runtime blocked, không ghi đè.

## Kiểm tra và giới hạn

64 unit test/8 file + check 120 asset; lint/build pass cục bộ. Kiểm tra live và viewport cuối cùng nằm trong STATUS.md. Các test mới bao phủ giới hạn chào hỏi, thưởng một lần, đơn thiếu hàng/quá hạn/id sai, đối soát giao đơn, nâng cấp và migration v3/v4. Chưa đo RAM/FPS trên máy thật; scene preload 120 SVG nên cần đo trước mở rộng dân số. Phaser bundle vẫn lớn. Chưa có khóa save nhiều tab, đường phố thứ hai hoặc đơn online.

Bản v5 bổ sung careerId cho activeOrder, dailyOrders(day, careerId) và đơn vị/sản phẩm theo nghề; rule hạn/giao một lần giữ nguyên.

## Mở rộng hội thoại và danh sách quen

120 người; 20 ID nối tiếp gồm công an, dân quân, cảnh sát giao thông, cứu hỏa, kỹ sư môi trường, kiến trúc sư, đường sắt, làm bánh, gốm, siêu thị. NPC cũ/đơn cũ giữ ID. dailyOrders dùng pool 100 người gốc để không invalid đơn trong save cũ. Payload hiện v6, xem SAVE_FORMAT.md; mục Save v4 ở trên mô tả lúc neighborhood ra đời.

Chào hỏi, chat trực tiếp, giao đơn mới tạo quan hệ. Xem hồ sơ và NPC trao đổi không tạo quen biết. Filter Quen biết và cấp 0–4 dùng bond/meetings; chat/chào chung giới hạn +3/người/ngày. Bộ lời thoại từ 50 tình huống có 1.000 biến thể duy nhất, xem DIALOGUE_SYSTEM.md.
