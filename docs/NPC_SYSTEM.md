# Hệ thống cư dân và nhiệm vụ

Cập nhật 30/09/2026. Dữ liệu hư cấu, không đại diện người thật. Phát triển tiếp từ `f276023081d5739d33e70b93d99eee5fb42dc66f`.

## 100 NPC

`npcCatalog.ts` chứa 100 tên/tuổi/giới tính được khai báo riêng, 50 nghề hoặc vai trò, 10 nhóm. 50 nam, 50 nữ; tuổi 7–82. Các vai trò trẻ em chỉ là học sinh; không có lao động trẻ em. `streetNpc()` luân phiên theo ngày/giờ và sequence, không rút RNG kinh tế. Ban đêm không chọn cư dân dưới 18. Scene hiển thị tối đa 10 NPC, không vẽ đồng thời cả 100.

`npcArt.ts` là renderer vector gốc của kho: mặt, tóc, kính, nếp nhăn, đồng phục, mũ và vật dụng nghề. Không dùng atlas nam/nữ người chơi. `scripts/generate-npcs.mjs` tạo 100 SVG tại `public/assets/npcs-v2/npc-001.svg` đến `npc-100.svg`, mỗi sheet 480×200, 4 frame 120×200. Tổng khoảng 863KB ký tự SVG trước gzip. Source SVG tự có title tiếng Việt, không phụ thuộc font để hiển thị mặt/đồ nghề.

```bash
pnpm assets:npcs
pnpm test
```

`pnpm test` chạy generator `--check` để phát hiện asset lệch catalog/renderer. Phaser preload SVG, thêm frame và animation 6fps; React `NpcPortrait` dùng cùng SVG với background-size 400% 100%. Cả hai dùng BASE_URL của Vite. Trẻ em thu nhỏ; người cao tuổi đi chậm hơn. NPC luôn có nghề/tuổi rõ trong sổ; một số nghề cùng loại đồng phục/vật dụng nhưng phối màu/tóc/mặt khác nhau.

## Quan hệ

Chào hỏi/hỏi chuyện nghề tạo tin nhắn có npcId, tối đa 40 tin. Lần trò chuyện đầu với một NPC trong ngày tăng 3 tình thân +3 XP; bấm lặp không tăng tiếp. Quan hệ gồm bond 0–100, greetedDay, meetings. Giao đơn tăng 8 tình thân và 15 XP. Các nhãn: đã làm quen, quen thuộc từ 25, thân thiết từ 60. Chưa có AI ngôn ngữ, cây hội thoại phân nhánh hay người chơi online.

## Đơn đặt

`dailyOrders(day)` tạo đúng 3 đề nghị cho cư dân trưởng thành theo lịch xác định; không phụ thuộc RNG kinh tế hay giá quầy. Mỗi đơn 3–6 phần, giá từng phần 20/22/24 nghìn; một đơn đang nhận. Nhận đơn lưu giá/số lượng/người nhận và thời hạn 120 phút game. Phải giao cùng ngày và không muộn hơn deadline. Đơn quá hạn giữ trên UI tới khi hủy để người chơi biết lý do.

Giao đơn là một action giao dịch: đủ hàng → trừ kho, cộng tiền/doanh thu, tăng giá vốn theo unitCost và customers theo số phần, lưu completed id, xóa active. Bấm giao lặp hoặc nhận lại id đã hoàn thành cùng ngày không trả tiền lần hai. completedOrders giữ 60 id gần nhất; chỉ nhận id thuộc ngày hiện tại. Hủy không mất tiền; có thể nhận lại đề nghị chưa hoàn thành. Đây là thao tác giao trọn đơn từ quầy, chưa có lộ trình đi giao hàng trên bản đồ.

## Mốc hành trình và nâng cấp

8 milestone khai báo trong `neighborhood.ts`; reward tiền/XP chỉ nhận một lần, kiểm tra lại tiến độ trong store. Reward là hỗ trợ từ khu phố, không cộng vào doanh thu bán hàng.

| Nâng cấp | Giá | Hiệu quả |
|---|---:|---|
| Mái che mở rộng | 90.000 | Hệ số nhu cầu mưa 0,55 → 0,78 |
| Tủ nguyên liệu | 140.000 | maxInventory +30, không tự thêm hàng |
| Biển hiệu | 100.000 | Hệ số marketing +0,15 cố định |

Mỗi nâng cấp mua một lần, cần quầy và đủ tiền; chi phí ghi vào dayStats.expenses. Hiện chưa thêm hình ảnh riêng cho nâng cấp vào cảnh, hiệu quả thể hiện ở chỉ số và danh sách “Đã lắp”. Một quầy xôi/một nhân viên vẫn là scope economy hiện tại.

## Save v4

`neighborhood` chứa relationships, activeOrder, completedOrders, deliveries, upgrades, claimedMilestones. `snapshotFromStore()` phải xuất nhóm này. v1–v3 thêm defaults, giữ economy/gender/position/chat có sẵn. v4 validate NPC id, số bond, milestone/upgrade id, giá/số lượng đơn theo đề nghị gốc; payload không hợp lệ → runtime blocked, không ghi đè.

## Kiểm tra và giới hạn

25 unit test/5 file + check 100 asset; lint/build pass cục bộ. Kiểm tra live và viewport cuối cùng nằm trong STATUS.md. Các test mới bao phủ giới hạn chào hỏi, thưởng một lần, đơn thiếu hàng/quá hạn/id sai, đối soát giao đơn, nâng cấp và migration v3/v4. Chưa đo RAM/FPS trên máy thật; scene preload 100 SVG nên cần đo trước mở rộng dân số. Phaser bundle vẫn lớn. Chưa có khóa save nhiều tab, đường phố thứ hai hoặc đơn online.
