# Bàn giao bản 100 cư dân

Ngày 30/09/2026. Mã cuối kiểm tra `d131043b17d7842ea171da06c8fde0523182d2bb`, triển khai Pages thành công. Đọc AGENTS.md → STATUS.md → ARCHITECTURE.md → NPC_SYSTEM.md/SAVE_FORMAT.md trước khi sửa. Có 25 test/5 file + check 100 SVG; lint/build pass cục bộ và CI.

## Những file cần biết

- `MainScene.ts`: world 1024×1536, background portrait, atlas người chơi nam/nữ; 100 texture NPC riêng nhưng tối đa 10 actor; roster nghề trộn, chạm NPC phát npc:selected. Bubble giới hạn 3; route chạm tránh xe xôi; không phải bản đồ rộng.
- `npcCatalog.ts`: 100 tên/tuổi/giới tính/nghề, advice và roster. `npcArt.ts`: renderer SVG 4 frame/sheet; `pnpm assets:npcs` tái tạo. `pnpm test` kiểm tra cả 100 asset khớp source.
- `neighborhood.ts`: schema, quan hệ, 3 đơn/ngày, 8 milestone và 3 upgrade. `gameStore.ts` thực hiện giao dịch, không để scene tự tạo tiền.
- `NeighborhoodPanel.tsx`, `NpcPortrait.tsx`: sổ/filter/hồ sơ/đơn/nhiệm vụ, dùng BASE_URL. Bảng mở bằng fade để mục tiêu chạm không trượt trong animation.
- `migrateSave.ts`: validate unknown và migrate v1–v4. Không reset dữ liệu để né migration. `snapshotFromStore` có neighborhood.
- `saveDb.ts`: autosave + backup lần ghi trước, `?demo=1` dùng DB riêng. Runtime blocked khi load lỗi, không ghi đè payload lỗi. Chưa khóa nhiều tab.
- `NoticeToast.tsx`: timeout 1000ms độc lập, cleanup; bubble/story có tuổi thọ khác.

## Điểm đã kiểm tra thực tế

Main giữ Minh/715.000/ngày8/pause. Demo nữ giữ quan hệ, thưởng đã nhận, đơn đã giao, tủ đã lắp và 475.000/16 trên 90 hàng qua reload. Viewport CSS 320/360/390/430 không tràn cả trang; bảng cuộn riêng. Chi tiết giao dịch/CI/ảnh trong STATUS.md. Không đặt lại dữ liệu chính trong kiểm thử.

## Việc tiếp theo cụ thể

1. Đo preload/RAM/FPS trên Android/iOS thật, có cân nhắc lazy texture/atlas tổng nếu số liệu yêu cầu; không tuyên bố benchmark từ iframe.
2. Kiểm tra một ca và quyết toán ngày đầy đủ; test deadline qua nửa đêm, thay đổi speed/pause và tương tác tình huống khi nhận đơn.
3. Thêm visual upgrade; lịch từng cư dân/đối thoại phân nhánh, hoặc đường đi giao hàng nếu chủ dự án ưu tiên.
4. Tách cấu hình nghề bán hàng trước thêm nghề thứ hai; 50 nghề NPC không phải 50 nghề economy có thể chơi.
5. Thêm lock nhiều tab và backup nhiều phiên/import có validate trước cloud save/online.

Không nâng dependency ngoài phạm vi. Giữ UTF-8, seed economy và save compatibility. Nguồn raster/prompt ở ASSETS.md/ART_PROMPTS.md; NPC vector là mã gốc trong kho.

## Bản ba nghề (v5)

Đọc BUSINESS_SYSTEM.md trước sửa economy/report. career và accounting dùng dữ liệu; một quầy, ba nghề, một nhân viên. Chuyển nghề chặn open/order/story, quote mua/thu hồi giữ portable upgrade. Report 30 ngày; cashOpening=null chỉ cho sổ từ save cũ, không đoán dòng tiền lịch sử. Có 41 test/6 file, full ca tự động/cashflow/fees/migration/Dexie. Scene đã thêm hình sản phẩm và upgrade. Xem STATUS.md cho bằng chứng live cuối. Ưu tiên tiếp: cân bằng nghề nhiều ngày, report/cashflow khi đổi nghề nhiều lần, khóa save nhiều tab; chưa nhiều quầy/chuỗi hoặc đầu tư.
