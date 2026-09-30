# Bàn giao bản ba nghề và báo cáo ngày

Ngày 30/09/2026. Mã runtime đã đối chiếu: `18a6569435ef271fda00f7d486d9747ead378992`. Đọc AGENTS.md → STATUS.md → ARCHITECTURE.md → BUSINESS_SYSTEM.md/NPC_SYSTEM.md/SAVE_FORMAT.md trước khi sửa. Có 42 test/6 file + check 100 SVG; lint, TypeScript và build pass. Bằng chứng triển khai/chơi thử cuối ở STATUS.md.

## Những file cần biết

- `careers.ts`: ba cấu hình xôi/bánh mì/trà sữa, giờ/công suất/giá/weather và quote thu hồi. Một quầy, ba lựa chọn nghề, một nhân viên; chưa có chuỗi nhiều quầy.
- `accounting.ts`/`simulation.ts`: bán theo tick, quyết toán đúng một lần, lời lỗ và dòng tiền, tối đa 30 báo cáo. `gameStore.ts` giữ ranh giới giao dịch/đổi nghề/kết thúc sớm.
- `CareerOptions.tsx`/`DayReports.tsx`: tab Nghề/Báo cáo trong Kinh doanh; quote mua/thu hồi, bảng lời lỗ và dòng tiền.
- `MainScene.ts`: world 1024×1536, nền phố Việt Nam, người chơi nam/nữ; tối đa 10 actor từ 100 NPC. GameCanvas khóa Phaser input khi mở bảng/onboarding. Quầy đổi màu/đồ bán theo nghề, mái che/tủ/biển hiệu hiện nâng cấp. Chạm đi tránh xe; chưa phải pathfinding bản đồ rộng.
- `npcCatalog.ts`/`npcArt.ts`: 100 hồ sơ hư cấu, renderer SVG 4 frame/sheet; `pnpm assets:npcs` tái tạo, test kiểm tra khớp source.
- `neighborhood.ts`/`NeighborhoodPanel.tsx`: quan hệ, 3 đơn/ngày theo sản phẩm, 8 milestone, 3 upgrade, sổ cư dân. ID đơn chung giữa nghề, không thể đổi nghề để nhận thêm đơn đã giao trong ngày.
- `migrateSave.ts`: validate unknown và migrate v1–v4 →v5. `cashOpening=null` là ngày từ save cũ chưa có dữ liệu; phải được chấp nhận cả lần load, hydrate và save tiếp. Không dựng lại lịch sử dòng tiền hoặc xóa save để né migration.
- `saveDb.ts`/`useGameRuntime.ts`: autosave mỗi 5 giây và backup lần trước; `?demo=1` dùng DB riêng. Load lỗi chặn tick/autosave. Chưa khóa nhiều tab: không chạy đồng thời hai phiên cùng hồ sơ khi kiểm thử.
- `NoticeToast.tsx`: timeout 1000ms độc lập; story giữ tới xử lý, bubble có tuổi thọ riêng.

## Kiểm tra đáng chú ý

42 test gồm full ca xôi có nhập hàng/marketing/nhân viên/thưởng/thuê/lương, đối soát dòng tiền, tự sang ngày và kết thúc sớm, report 30 ngày, đổi nghề giữ upgrade/staff, và Dexie cũ →load→hydrate→save→reload. Bản đầu của đợt này tái hiện lỗi kiểm tra `cashOpening=null` lần thứ hai; đã sửa và thêm regression test, không thay dữ liệu cũ. Live và viewport xem STATUS.md.

## Việc tiếp theo cụ thể

1. Cân bằng ba nghề qua nhiều ngày chơi, kiểm tra trải nghiệm thiếu vốn/tồn kho/giờ bán. Test hiện có chưa chứng minh độ cân bằng dài hạn.
2. Khóa save giữa nhiều tab, backup nhiều phiên và import có validate trước khi làm cloud save/online.
3. Đo preload/RAM/FPS trên Android/iOS thật; lazy texture/atlas tổng chỉ khi số liệu cho thấy cần. Iframe không phải benchmark thiết bị.
4. Lịch từng cư dân, đối thoại phân nhánh hoặc đường đi giao hàng; hiện giao từ bảng. 50 nghề/vai trò NPC không phải 50 nghề economy chơi được.
5. Nhiều quầy/chuỗi/công ty cần thiết kế schema, nhân viên và quyết toán riêng; không nhân bản quầy UI rồi dùng chung tiền/tồn kho.

Giữ UTF-8, seeded economy, save compatibility và dependency/lockfile hiện có. Xem ASSETS.md/ART_PROMPTS.md cho raster; NPC/quầy vector là mã trong kho.
