# Bàn giao bản UI, cư dân, hội thoại và đua top

Ngày 30/09/2026. Mã runtime mới nhất xem STATUS.md. Đọc AGENTS.md → STATUS.md → ARCHITECTURE.md → COMPETITION_SYSTEM.md/BUSINESS_SYSTEM.md/NPC_SYSTEM.md/SAVE_FORMAT.md trước khi sửa. Có 64 test/8 file + check 120 SVG; lint, TypeScript và build pass. Bằng chứng triển khai/chơi thử cuối ở STATUS.md.

## Những file cần biết

- `careers.ts`: ba cấu hình xôi/bánh mì/trà sữa, giờ/công suất/giá/weather và quote thu hồi. Một quầy, ba lựa chọn nghề, một nhân viên; chưa có chuỗi nhiều quầy.
- `accounting.ts`/`simulation.ts`: bán theo tick, quyết toán đúng một lần, lời lỗ và dòng tiền, tối đa 30 báo cáo. `gameStore.ts` giữ ranh giới giao dịch/đổi nghề/kết thúc sớm.
- `CareerOptions.tsx`/`DayReports.tsx`: tab Nghề/Báo cáo trong Kinh doanh; quote mua/thu hồi, bảng lời lỗ và dòng tiền.
- `MainScene.ts`: world 1024×1536, nền phố Việt Nam, người chơi nam/nữ; tối đa 10 actor từ 120 NPC. GameCanvas khóa Phaser input khi mở bảng/onboarding. Quầy đổi màu/đồ bán theo nghề, mái che/tủ/biển hiệu hiện nâng cấp. Chạm đi tránh xe; chưa phải pathfinding bản đồ rộng.
- `npcCatalog.ts`/`npcArt.ts`: 120 hồ sơ hư cấu, renderer SVG 4 frame/sheet; `pnpm assets:npcs` tái tạo, test kiểm tra khớp source.
- `neighborhood.ts`/`NeighborhoodPanel.tsx`: quan hệ, 3 đơn/ngày theo sản phẩm, 8 milestone, 3 upgrade, sổ cư dân. ID đơn chung giữa nghề, không thể đổi nghề để nhận thêm đơn đã giao trong ngày.
- `migrateSave.ts`: validate unknown và migrate v1–v5 →v6. `cashOpening=null` là ngày từ save cũ chưa có dữ liệu; phải được chấp nhận cả lần load, hydrate và save tiếp. Không dựng lại lịch sử dòng tiền hoặc xóa save để né migration.
- `saveDb.ts`/`useGameRuntime.ts`: autosave mỗi 5 giây và backup lần trước; `?demo=1` dùng DB riêng. Load lỗi chặn tick/autosave. Chưa khóa nhiều tab: không chạy đồng thời hai phiên cùng hồ sơ khi kiểm thử.
- `NoticeToast.tsx`: timeout 1000ms độc lập; story giữ tới xử lý, bubble có tuổi thọ riêng.

## Kiểm tra đáng chú ý

64 test/8 file hiện tại bao gồm các bài của bản42 test: full ca xôi có nhập hàng/marketing/nhân viên/thưởng/thuê/lương, đối soát dòng tiền, tự sang ngày và kết thúc sớm, report 30 ngày, đổi nghề giữ upgrade/staff, và Dexie cũ →load→hydrate→save→reload. Bản đầu của đợt này tái hiện lỗi kiểm tra `cashOpening=null` lần thứ hai; đã sửa và thêm regression test, không thay dữ liệu cũ. Live và viewport xem STATUS.md.

## Việc tiếp theo cụ thể

1. Cân bằng ba nghề qua nhiều ngày chơi, kiểm tra trải nghiệm thiếu vốn/tồn kho/giờ bán. Test hiện có chưa chứng minh độ cân bằng dài hạn.
2. Khóa save giữa nhiều tab, backup nhiều phiên và import có validate trước khi làm cloud save/online.
3. Đo preload/RAM/FPS trên Android/iOS thật; lazy texture/atlas tổng chỉ khi số liệu cho thấy cần. Iframe không phải benchmark thiết bị.
4. Lịch từng cư dân, đối thoại phân nhánh hoặc đường đi giao hàng; hiện giao từ bảng. 60 nghề/vai trò NPC không phải60 nghề economy chơi được.
5. Nhiều quầy/chuỗi/công ty cần thiết kế schema, nhân viên và quyết toán riêng; không nhân bản quầy UI rồi dùng chung tiền/tồn kho.

Giữ UTF-8, seeded economy, save compatibility và dependency/lockfile hiện có. Xem ASSETS.md/ART_PROMPTS.md cho raster; NPC/quầy vector là mã trong kho.


## Tiếp tục bản competition v6

competition.ts/rivalSimulation.ts tách schema/chính sách khỏi mô phỏng chung; gameStore gọi wrapper, không gọi simulateTick trực tiếp khi tick/finish. snapshotFromStore phải có competition. Ba NPC dùng seed riêng và chi phí cùng người chơi; thứ hạng tính tài sản ước tính, chưa hệ thống vốn/server online.

Chặn đổi nghề khi activeDuel. Thưởng chỉ một lần sau report, ghi communityRewards của ngày nhận. Save v5 nghề trà sữa/đơn/report/nullable cash vẫn giữ; không migrate v5 về xôi. Bản cũ được thi đua từ ngày kế tiếp, NPC không chạy bù quá khứ. Mốc runtime hiện tại và chơi thử cuối xem STATUS.md; không dùng hash bản ba nghề để tuyên bố kiểm tra bản này.

Ưu tiên thêm: cân bằng NPC/độ khó thử thách qua nhiều ngày, automation nhập hàng có giới hạn cho người chơi, save nhiều tab/backup/import, thiết bị thật. Chưa tăng scope lên bảng quốc gia hoặc online.

## Điểm mới cần giữ

- dialogue.ts: 50 cặp hỏi đáp ×20 biến thể =1.000 chuỗi, không phải1.000 tình huống. chat.ts chọn mẫu theo ngữ cảnh/từ khóa, NPC trao đổi không ghi quen. interactionPatch dùng chung cho chat/chào giới hạn ngày.
- IDs101–120 nối tiếp; kế toán có máy tính, công an/dân quân có đồng phục/bộ đàm. dailyOrders cố định pool variant<100 để order cũ vẫn valid. Đừng thay pool mà không thiết kế version.
- traffic.ts chỉ graphics,6loại/max3; không RNGkinh tế. Panel header/body và chat history/composer giữ riêng; tabs đổi phải cuộn body về đầu.
- Ưu tiên cân bằng đối thủ + automation nhập hàng có giới hạn; benchmark thiết bị, khóa nhiều tab; sau đó hội thoại có trí nhớ/đường đi giao hàng.
