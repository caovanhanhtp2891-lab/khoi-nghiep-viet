# Kiến trúc hiện tại

Cập nhật bản đối thủ ngày 30/09/2026; mốc mã đã kiểm tra xem STATUS.md. Đây là một ứng dụng frontend Vite, chưa có backend trong kho.

## Công nghệ và entry point

React + TypeScript cho giao diện; Phaser cho khu phố 2D; Zustand cho trạng thái; Dexie/IndexedDB cho save; Vitest cho test; Oxlint cho lint. Phiên bản chính xác đọc `package.json` và `pnpm-lock.yaml`.

`index.html` → `src/main.tsx` → `src/App.tsx`. `main.tsx` dùng React StrictMode nên effects phải cleanup đúng.

## Bản đồ mã

| Đường dẫn | Trách nhiệm |
|---|---|
| `src/domain/types.ts` | Snapshot, entity, event result và hằng số tiền/thời gian |
| `src/domain/simulation.ts` | RNG có seed, nhu cầu, bán hàng, ngày mới, thời tiết, chi phí |
| `src/domain/situations.ts` | Nội dung và sinh lựa chọn tình huống NPC |
| `src/domain/migrateSave.ts` | Validate unknown save, migrate v1/v2/v3/v4/v5/v6 |
| `src/domain/chat.ts` | Lời NPC theo thời gian/thời tiết |
| `src/domain/format.ts` | Định dạng số, tiền, thời gian |
| `src/store/initialState.ts` | Snapshot mới version 6 |
| `src/store/gameStore.ts` | Actions, hydrate, reset, xuất snapshot và phát event |
| `src/hooks/useGameRuntime.ts` | Load trước khi sẵn sàng, tích lũy thời gian, autosave |
| `src/services/saveDb.ts` | Database, autosave/backup, export và recovery |
| `src/game/GameCanvas.tsx` | Import Phaser động, khởi tạo/destroy game |
| `src/game/MainScene.ts` | Nền phố portrait, NPC SVG/nhân vật atlas, di chuyển/chạm thoại, xe máy và hiệu ứng |
| `src/game/events.ts` | EventTarget bridge với kiểu dữ liệu |
| `src/components/` | HUD, điều hướng, bảng chức năng, tutorial, welcome, lựa chọn story |
| `src/App.css`, `src/index.css` | Bố cục, theme, responsive |
| `public/` | Manifest, icon, raster phố/người chơi, 120 SVG NPC và asset lịch sử |
| `vite.config.ts` | Base tương đối, build ES2022, test môi trường node |

## Luồng nghiệp vụ

1. Người chơi bấm nút React → action của Zustand kiểm tra điều kiện và cập nhật state.
2. Runtime dùng interval 100 ms, `performance.now()` và accumulator; mỗi 2.000 ms tích lũy ở 1× gọi `advanceTick(5)`.
3. `advanceTick()` xuất snapshot dữ liệu → `simulateTick()` trả state mới, doanh thu và thông tin tick → store cập nhật.
4. React đọc store để hiển thị; Phaser nhận event và vẽ hiệu ứng.
5. Autosave gọi `snapshotFromStore()` để tách function actions khỏi dữ liệu, rồi ghi IndexedDB.

Khi pause, accumulator được đặt về 0. Elapsed mỗi lần được giới hạn 1.000 ms và vòng tick tối đa 8 lần. Cơ chế này không phải offline catch-up; không suy luận có doanh thu khi tắt game.

## Bridge React–Phaser

| Event | Payload | Cách dùng hiện tại |
|---|---|---|
| `simulation:update` | `GameSnapshot` | Đồng bộ cảnh theo trạng thái nghiệp vụ |
| `business:selected` | `undefined` | Chạm quầy để mở bảng kinh doanh |
| `sale` | `{ count, revenue }` | Hiệu ứng khách và số tiền; tiền đã được tính trong domain |
| `player:focus` | `undefined` | Hiện bubble tìm nhân vật |
| `npc:selected` | `string` NPC id | Chạm cư dân mở hồ sơ trong bảng khu phố |
| `reset` | `undefined` | Cảnh đọc lại trạng thái khi chơi lại |

Các subscription trả hàm unsubscribe. React effects và Phaser shutdown phải gọi cleanup. State chỉ đổi qua store/domain; thêm animation không được phát sinh thêm giao dịch.

## Mô phỏng đang có

- Ba nghề lấy giờ bán/công suất/weather từ careers.ts; quầy tự đóng khi hết ca.
- Nhu cầu là tích các hệ số thời gian, thời tiết, giá, chất lượng, uy tín, marketing.
- Khách/tick dùng stochastic rounding theo RNG có seed; số bán = min(khách đến, công suất, tồn kho).
- Cuối ngày trừ tiền thuê 35.000 VNĐ và lương nếu có nhân viên, tổng hợp lợi nhuận rồi reset thống kê ngày và đổi thời tiết.
- Scene dùng ngẫu nhiên hình ảnh độc lập; số NPC nhìn thấy không phải số khách thật của sổ kinh doanh.
- Tình huống được xét trong giờ bán, khi không có tình huống đang chờ và cách lần trước ít nhất 75 phút game. Quyết định được xử lý ở store.

## Ranh giới khi mở rộng

Nghề đã lấy cấu hình từ careers.ts; thêm nghề cần cập nhật catalog/save/test, không hard-code trong UI. Thêm online cần thiết kế backend có thẩm quyền giao dịch, không coi client hiện tại là server. Đổi save phải làm theo SAVE_FORMAT.md. Không chuyển ngay sang monorepo chỉ vì PLAN.md mô tả kiến trúc tương lai.

## Street Edition

Scene dùng world 1024×1536, background raster, camera cover theo viewport. Người chơi dùng 4 frame nam và 4 frame nữ; NPC dùng sheet SVG riêng; atlas 1254×1254 có frame x được làm tròn để không cắt nhầm cột. Pointer chỉ nhận vùng vỉa hè; store lưu vị trí normalized. NPC và xe máy là hình ảnh, không tự phát sinh tiền.

Chat trong store là lịch sử local; tick thêm tin mỗi 30 phút game và sendChat tạo lời đáp NPC. React render text, không render HTML người chơi. NoticeToast quản lý tuổi thọ 1 giây độc lập; tình huống story dạng gập/mở chờ người chơi.

Load lỗi chuyển blocked, giữ ready=false nên tick/persist không chạy. Xem SAVE_FORMAT.md để sửa dữ liệu an toàn.

## Cư dân (payload v4)

- `domain/npcCatalog.ts`: 120 identity, role advice, roster theo giờ/ngày.
- `domain/npcArt.ts` + `scripts/generate-npcs.mjs`: renderer SVG + generator/check 120 sheet.
- `domain/neighborhood.ts`: schema quan hệ/đơn/mốc/nâng cấp và cấu hình economy.
- `store/gameStore.ts`: chào hỏi, giao đơn, nhận thưởng, mua upgrade trong action giao dịch.
- `components/NeighborhoodPanel.tsx`, `NpcPortrait.tsx`: sổ/filter/detail/đơn/nhiệm vụ.
- `game/events.ts`: npc:selected chuyển scene → panel; scene không tự quyết định quan hệ/doanh thu.

Chi tiết và cách thêm cư dân xem [NPC_SYSTEM.md](NPC_SYSTEM.md).

## Careers và accounting v5

`domain/careers.ts`: cấu hình ba nghề, quote đổi, giờ/đơn vị sản phẩm. `accounting.ts`: freshDayStats, closeDayReport, cash reconciliation. `simulation.ts` chốt ngày cũ → report → phí → sổ mới. Store cập nhật các dòng tiền khi mua quầy/restock/chuyển nghề/thưởng. `CareerOptions.tsx` và `DayReports.tsx` nằm trong các tab Kinh doanh; scene vẽ đồ bán/upgrade, không phát sinh giao dịch. Xem BUSINESS_SYSTEM.md.


## Đối thủ v6

Runtime/store gọi `rivalSimulation.simulateWorldTick` bọc mô phỏng người chơi và ba NPC. NPC dùng `simulateTick` chung, ledger/seed riêng, không sinh story. Chính sách mua hàng/marketing/tuyển/nâng cấp có ngân sách; quyết toán cùng ngày và cùng thời tiết. `competition.ts` định nghĩa schema/valuation/rank/duel/validation; `CompetitionPanel.tsx` nằm trong tab Đua top của Cư dân. finishDay mô phỏng ca còn lại của NPC nhưng đóng quầy người chơi, chốt duel từ report và baseline. Chi tiết COMPETITION_SYSTEM.md. Phaser chỉ hiển thị, không quyết định kết quả hay tiền thưởng.

Hội thoại: dialogue.ts chứa bank/selector thuần; chat.ts ghép reply/exchange; gameStore giới hạn giao lưu/XP và lịch sử. traffic.ts chỉ vẽ; không quyết định economy. GamePanel header/body và ChatPanel history/composer có vùng cuộn tách biệt. Xem DIALOGUE_SYSTEM.md.

### Màn hình chính

App dùng bốn hàng: TopHud / GameCanvas / MainActions / BottomNav. MainActions hiển thị dự toán nhập hàng cùng công thức min(20, sức chứa trống) của store; gọi restock/toggleBusiness, không sửa tiền trực tiếp. Không có schema mới. Các lớp story/notices còn trong stage; thanh thao tác chiếm hàng riêng để tránh che khu phố. GamePanel focus/Tab/Escape tại lớp React, Phaser input vẫn bị khóa khi bảng mở. Xem MAIN_SCREEN.md.
