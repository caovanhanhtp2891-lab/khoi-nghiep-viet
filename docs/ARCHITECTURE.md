# Kiến trúc hiện tại

Đối chiếu mã tại `7fed1c563a7e3493b329c51bcbef10b98e595db5`, ngày 30/09/2026. Đây là một ứng dụng frontend Vite, chưa có backend trong kho.

## Công nghệ và entry point

React + TypeScript cho giao diện; Phaser cho khu phố 2D; Zustand cho trạng thái; Dexie/IndexedDB cho save; Vitest cho test; Oxlint cho lint. Phiên bản chính xác đọc `package.json` và `pnpm-lock.yaml`.

`index.html` → `src/main.tsx` → `src/App.tsx`. `main.tsx` dùng React StrictMode nên effects phải cleanup đúng.

## Bản đồ mã

| Đường dẫn | Trách nhiệm |
|---|---|
| `src/domain/types.ts` | Snapshot, entity, event result và hằng số tiền/thời gian |
| `src/domain/simulation.ts` | RNG có seed, nhu cầu, bán hàng, ngày mới, thời tiết, chi phí |
| `src/domain/situations.ts` | Nội dung và sinh lựa chọn tình huống NPC |
| `src/domain/format.ts` | Định dạng số, tiền, thời gian |
| `src/store/initialState.ts` | Snapshot mới version 2 |
| `src/store/gameStore.ts` | Actions, hydrate, reset, xuất snapshot và phát event |
| `src/hooks/useGameRuntime.ts` | Load trước khi sẵn sàng, tích lũy thời gian, autosave |
| `src/services/saveDb.ts` | Database và đọc/ghi slot autosave |
| `src/game/GameCanvas.tsx` | Import Phaser động, khởi tạo/destroy game |
| `src/game/MainScene.ts` | Vẽ bản đồ, NPC, quầy, hiệu ứng bán/mưa/ánh sáng |
| `src/game/events.ts` | EventTarget bridge với kiểu dữ liệu |
| `src/components/` | HUD, điều hướng, bảng chức năng, tutorial, welcome, lựa chọn story |
| `src/App.css`, `src/index.css` | Bố cục, theme, responsive |
| `public/` | Manifest, icon và 12 ảnh NPC |
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
| `reset` | `undefined` | Cảnh đọc lại trạng thái khi chơi lại |

Các subscription trả hàm unsubscribe. React effects và Phaser shutdown phải gọi cleanup. State chỉ đổi qua store/domain; thêm animation không được phát sinh thêm giao dịch.

## Mô phỏng đang có

- Quầy xôi hoạt động 05:30 đến trước 10:00; tự đóng lúc 10:00.
- Nhu cầu là tích các hệ số thời gian, thời tiết, giá, chất lượng, uy tín, marketing.
- Khách/tick dùng stochastic rounding theo RNG có seed; số bán = min(khách đến, công suất, tồn kho).
- Cuối ngày trừ tiền thuê 35.000 VNĐ và lương nếu có nhân viên, tổng hợp lợi nhuận rồi reset thống kê ngày và đổi thời tiết.
- Scene dùng ngẫu nhiên hình ảnh độc lập; số NPC nhìn thấy không phải số khách thật của sổ kinh doanh.
- Tình huống được xét trong giờ bán, khi không có tình huống đang chờ và cách lần trước ít nhất 75 phút game. Quyết định được xử lý ở store.

## Ranh giới khi mở rộng

Thêm nghề cần tách cấu hình giá vốn/giờ bán/công suất khỏi các giả định quầy xôi. Thêm online cần thiết kế backend có thẩm quyền giao dịch, không coi client hiện tại là server. Đổi save phải làm theo SAVE_FORMAT.md. Không chuyển ngay sang monorepo chỉ vì PLAN.md mô tả kiến trúc tương lai.
