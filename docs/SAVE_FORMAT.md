# Save format version 6

Cập nhật 30/09/2026. Database Dexie `khoi-nghiep-viet` vẫn version 1, bảng `saves` index `id, savedAt`; envelope schemaVersion vẫn 1. Payload game hiện version **6**. `?demo=1` dùng database `khoi-nghiep-viet-demo` riêng.

## Slot và envelope

| Slot | Mục đích |
|---|---|
| autosave | Tiến độ mới nhất |
| backup | Bản trước lần ghi autosave gần nhất, không phải lịch sử nhiều phiên |

Record `{ id, schemaVersion: 1, savedAt: ISO string, payload }`. Đọc payload unknown, validate/migrate trước hydrate. Transaction ghi backup rồi autosave. Loader không tự xóa dữ liệu hỏng; runtime blocked chặn tick/persist. UI cho export raw records hoặc restore backup đã validate.

## Snapshot

GameSnapshot gồm player/world/business/dayStats/reports/lifetime/story/tutorial/notices/chat/chatSeq, neighborhood và competition. Player có gender male/female, position {x,y} normalized. Chat tối đa 40 tin, npcId tùy chọn để gắn portrait; story history tối đa 8.

Neighborhood gồm:

| Trường | Nội dung |
|---|---|
| relationships | NPC id → {bond 0–100, greetedDay, meetings} |
| activeOrder | null hoặc id/npcId/day/careerId/quantity/unitPrice/acceptedAt/dueAt |
| completedOrders | Tối đa 60 id đơn đã giao gần nhất |
| deliveries | Tổng đơn hoàn thành |
| upgrades | canopy/storage/sign, mỗi loại một lần |
| claimedMilestones | ID milestone đã nhận thưởng một lần |

NPC/milestone/upgrade id được validate bằng catalog. Đơn active phải khớp giá, số lượng, NPC trong dailyOrders(day, careerId); dueAt=acceptedAt+120. Đơn cũ hết hạn vẫn load được để người chơi hủy, không được giao sau hạn hoặc khác ngày. Chi tiết rule và đối soát xem [NPC_SYSTEM.md](NPC_SYSTEM.md).

## Migration

- v1: có thể thiếu story; thêm defaults. Player chưa có gender/position.
- v2: có story, chưa gender/position; thêm mặc định, giữ tiền/tồn kho/thời gian/seed.
- v3: giữ giới tính/vị trí/chat, thêm neighborhood mặc định.
- v4: validate nhóm mới cùng dữ liệu cũ. Phiên bản tương lai chưa hỗ trợ → exception và blocked.
- Migrate về v6, clamp vị trí x 0,08–0,92/y 0,64–0,79; notices transient không phát lại. Story cũ có title hỏng dấu hỏi được bỏ tình huống đó, giữ economy.
- Không chạy offline catch-up, không tự đổi pause sang false. Snapshot phải gồm neighborhood khi autosave; không serialize function actions.

Autosave mỗi 5 giây, tab ẩn và runtime cleanup; tránh hai persist đồng thời trong một instance. Vị trí cập nhật khi đến đích/thả phím; save đang đi có thể giữ điểm trước hành trình.

## Kiểm thử và giới hạn

Dexie test fake-indexeddb: v2 load, v1 thiếu story, round-trip nữ/vị trí/chat/quan hệ/upgrade/milestone/tiền/RNG/pause, payload hỏng/tương lai còn nguyên, backup restore. Neighborhood test thêm v3→v5 và đơn/quan hệ sai. Live reload giữ cả tiến độ chính và tiến độ demo mới; chi tiết STATUS.md.

IndexedDB phụ thuộc origin/profile, không phải ID phần cứng hay đồng bộ nhiều máy. Chưa import UI, backup nhiều phiên, lock/xử lý xung đột nhiều tab hay cloud save. Không mở nhiều tab cùng một hồ sơ để kiểm thử giao dịch; dùng demo riêng với hồ sơ chính.

## v5 — career và báo cáo

Business thêm careerId (xoi/banhmi/trasua); activeOrder thêm careerId. Snapshot thêm reports tối đa 30 ngày. dayStats/report có cashOpening (nullable), stockPurchases, capitalPurchases, recoveries, communityRewards và careerIds. Reports lưu fee/profit/cashClosing và ngày/weather. v1–v4 thêm xoi, giữ economy/nhân vật/quan hệ, chuyển active order v4 sang xoi. Không dựng số liệu quá khứ: sổ ngày cũ có cashOpening=null và không thêm report giả; ngày sau có đủ. v5 validate nghề/cost/giá, order cùng nghề, sổ và công thức profit trong báo cáo. Xem BUSINESS_SYSTEM.md và careers.test.ts.

Luồng runtime validate hai lần: `loadGame` rồi `hydrate`; kiểm thử regression chạy cả hai, autosave lại và reload. `cashOpening=null` của ngày cũ và báo cáo ngày đó phải hợp lệ ở mọi bước; ngày tiếp theo có số dư đầu ngày cụ thể.


## v6 — competition

competition lưu ba rival với ledger/seed/quầy/upgrade/lastReport, joinedAt/eligibleFromDay, 16 news, activeDuel và lastDuelDay, 30 kết quả/claimed. v1–v5 giữ dữ liệu cũ rồi tạo rivals tại world hiện tại, không chạy quá khứ; eligibleFromDay là ngày sau với save cũ. v5 career/order/report được validate và giữ, không đổi về xôi. v6 giữ nullable cashOpening của player lịch sử ở mọi lần load/hydrate/save. validateCompetition đối soát tiền NPC và chặn id trùng, nghề/cost/stock sai, news tương lai, result/outcome/claimed sai. Xem COMPETITION_SYSTEM.md.

### Mở rộng nội dung giữ v6

120 cư dân nối tiếp ID, bank hội thoại/phương tiện không thêm dữ liệu persist. Quan hệ/chat mới dùng cùng schema v6. Pool đề nghị đơn vẫn 100 cư dân gốc, không thay công thức modulo của order cũ. Chi tiết DIALOGUE_SYSTEM.md.
