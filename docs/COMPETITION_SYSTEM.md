# Đối thủ, bảng xếp hạng và thi đua (payload v6)

Đây là hệ thống cục bộ trong Cư dân → Đua top, gồm người chơi và ba chủ quầy NPC hư cấu. Không có người thật, server, bảng tỉnh/quốc gia hay doanh thu lúc tắt game.

## Module và dữ liệu

| Module | Trách nhiệm |
|---|---|
| `domain/competition.ts` | Ba định nghĩa, khởi tạo, tính tài sản/xếp hạng, điều kiện thắng và validate dữ liệu unknown |
| `domain/rivalSimulation.ts` | Quyết định tự động có trả tiền, chạy cùng simulateTick, quyết toán thử thách và tin chat |
| `domain/simulation.ts` | Công thức nhu cầu/bán/chi phí chung, nhận tùy chọn bỏ story cho NPC và hệ số cạnh tranh |
| `store/gameStore.ts` | Nhận thi đua/nhận thưởng, chuyển nghề bị chặn khi thi đua, advance/finish gọi simulateWorldTick |
| `components/CompetitionPanel.tsx` | Hạng, tiêu chí, cách tính tài sản, thử thách, hồ sơ tài chính và tin mới |

Snapshot thêm `competition`: joinedAt, eligibleFromDay, rivals, news/newsSeq, activeDuel, lastDuelDay, history. Mỗi rival lưu id/cash/business/dayStats/rngSeed/upgrades/lastPlanDay/lastReport. Không lưu GameSnapshot lồng hoặc function trong actor.

## Ba chủ quầy

| NPC | Nghề/quầy | Chính sách giá |
|---|---|---|
| npc-011 · Chú Sáu | Xôi Chú Sáu | Giá mặc định 22.000đ/phần |
| npc-013 · Anh Tài | Bánh Mì Anh Tài | Thấp hơn mặc định 2.000đ: 23.000đ/ổ |
| npc-018 · Trâm | Trà Sữa Trâm | 32.000đ/ly, ngày hot tăng 2.000đ |

Mỗi NPC có vốn 1.000.000đ, mua dụng cụ và 20 nguyên liệu theo đúng giá người chơi; tiền còn lần lượt 520.000/400.000/200.000đ. Không cộng tiền bù theo hạng người chơi. Dùng portrait/sprite NPC riêng hiện có.

Trong ca: đặt giá và marketing tối đa một lần/ngày. Marketing 50.000đ nếu còn dự phòng 300.000đ; tuyển một nhân viên 70.000đ nếu còn 500.000đ sau phí tuyển, lương 120.000đ/ngày. Khi đủ vốn mua canopy/storage/sign theo cùng giá người chơi và ghi expense; storage thêm 30 chỗ. Nhập tối đa 20 khi hàng dưới ba lượt công suất, chỉ dùng tiền còn sau dự phòng tiền thuê/lương. Không đủ tiền thì ngừng mua, không tạo hàng hoặc tiền miễn phí. Quyết định cụ thể là cấu hình cân bằng, có thể thay đổi sau playtest.

Bán hàng gọi **simulateTick chung**: cùng giá vốn, công suất, thời tiết, ca, stochastic rounding, thuê/lương, reputation và marketing decay. Mỗi NPC dùng seed riêng, không tiêu thụ seed người chơi; story chỉ chạy cho người chơi. Tin tức phản ánh mua/marketing/giá đã áp dụng, tối đa 16 tin, tối đa 3 tin mới vào Chat mỗi lần cập nhật.

Một đối thủ cùng nghề đang mở và còn hàng nhân nhu cầu người chơi với 0,88. NPC cũng nhận hệ số 0,88 khi người chơi cùng nghề đang mở và còn hàng. Ngoài ca hoặc hết hàng không tạo áp lực. Đây là hệ số cạnh tranh có giới hạn, chưa phải chia một pool khách bảo toàn giữa mọi quầy. UI Vận hành có hàng Cạnh tranh để giải thích.

## Đồng hồ, quyết toán và kết thúc sớm

Runtime gọi simulateWorldTick theo game time, mặc định 5 phút. Pause/onboarding dừng tick cả NPC và người chơi. Rival xử lý từng lát tối đa 5 phút, cả khi finishDay bỏ qua thời gian còn lại; người chơi đóng quầy khi kết thúc sớm nên không có doanh thu thêm. Thuê/lương NPC được trừ đúng một lần ở nửa đêm. lastReport chứa sổ ngày vừa kết thúc; tiền đầu ngày mới là cashClosing sau phí. Thời tiết chung là thời tiết của người chơi, seed NPC chỉ phục vụ economy riêng.

Không chạy tiến độ khi app đóng hoặc đọc giờ thực. UI thông báo rõ đối thủ vẫn bán hết ca khi người chơi chọn kết thúc ngày sớm.

## Xếp hạng

- Tài sản ước tính = tiền mặt (kể cả âm) + tồn kho theo giá vốn + 50% vốn dụng cụ + 50% giá nâng cấp. Quầy chưa sở hữu không có giá trị kho/dụng cụ/nâng cấp. Giá trị này dùng so hạng, không phải nút nhận tiền hay chức năng bán nâng cấp.
- Doanh thu = doanh thu hôm nay.
- Lợi nhuận = doanh thu − giá vốn − operating expense − thuê/lương dự kiến.
- Đồng điểm cùng hạng; vị trí tiếp theo theo thứ tự cạnh tranh (1,1,3...). UI hiển thị khoảng cách tới người có điểm cao hơn gần nhất.
- Chỉ bốn người trong khu phố cục bộ. Không tự thêm hạng thế giới bằng số giả.

## Thử thách trong ngày

Cần sở hữu quầy, tối đa một thử thách/ngày, nhận khi còn ít nhất 120 phút trước giờ đóng ca. Đối thủ cùng nghề; lưu mốc profit trước thuê/lương và số hàng đã bán của người chơi, mốc profit của NPC tại lúc nhận. Đổi nghề bị chặn đến khi quyết toán.

Khi sang ngày mới: profit thi đua = profit báo cáo ngày − profit tại lúc nhận. Thuê/lương của ngày vẫn trừ toàn bộ, còn chi phí/doanh thu trước nhận được loại khỏi so sánh. Cần ít nhất 10 sản phẩm bán sau nhận, profit >0 và cao hơn đối thủ (hòa không thắng). Kết quả tối đa 30 ngày. Không nhận/hủy liên tục để đổi baseline.

Thắng mở nút nhận 50.000đ +60 XP một lần. Tiền thưởng đi vào communityRewards của ngày nhận, không revenue, không sửa report đã chốt. Thua không bị phạt thêm. Phần thưởng chưa nhận hết hạn khi kết quả ra khỏi 30 bản ghi gần nhất.

## Save và kiểm thử

v1–v5 →v6 giữ player/business/world/RNG/đơn/báo cáo/nhân viên/nâng cấp, tạo NPC tại thời gian hiện tại; không mô phỏng lại quá khứ. Save lịch sử chỉ thi đua từ ngày tiếp theo để không so ngày thiếu dữ liệu. cashOpening=null từ lịch sử vẫn hợp lệ. load→hydrate→save→reload giữ challenge/claim/seed/ledger; không khởi tạo lại NPC mỗi lần tải.

Validate đúng ba id riêng, nghề/dụng cụ/cost/giá/kho/seed, số liệu và đối soát cash NPC; tin không ở tương lai, thứ tự kết quả, outcome/claim và baseline thi đua. Đây là kiểm tra hỏng dữ liệu trên client, không phải chống gian lận online.

`competition.test.ts` bao phủ vốn đầu, tài sản/tie/metrics, determinism/seed, ca/chi phí/stock, ngày đầy đủ và fee một lần, pause/skip, baseline/chặn đổi nghề, thắng/thua/thưởng một lần, v5 migration và Dexie tiếp tục, dữ liệu hỏng còn nguyên và giới hạn history/news. Kết quả cuối/live xem STATUS.md.
