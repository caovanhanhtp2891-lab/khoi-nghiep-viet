# Save format và nâng phiên bản

Đối chiếu mã ngày 30/09/2026 tại `7fed1c563a7e3493b329c51bcbef10b98e595db5`.

## Vị trí lưu hiện tại

Dexie mở IndexedDB tên `khoi-nghiep-viet`, database version 1, bảng `saves` với index `id, savedAt`. Có một slot `autosave`.
Dữ liệu gắn với origin và hồ sơ trình duyệt, không phải ID phần cứng. Đổi domain/trình duyệt, xóa dữ liệu website hoặc dùng chế độ riêng tư có thể không truy cập được save cũ. Chưa có cloud sync.

## Ba loại phiên bản độc lập

| Trường | Giá trị hiện tại | Ý nghĩa |
|---|---|---|
| Dexie database version | 1 | Cấu trúc bảng/index IndexedDB |
| `SaveRecord.schemaVersion` | 1 | Envelope lưu |
| `payload.version` | 2 cho game mới; type nhận 1 hoặc 2 | Cấu trúc snapshot nghiệp vụ |

Không tăng cả ba một cách máy móc. Thay đổi bảng, envelope hoặc payload phải có kế hoạch riêng.

Envelope hiện tại:

```ts
interface SaveRecord {
  id: 'autosave'
  schemaVersion: 1
  savedAt: string // ISO timestamp thực, không phải game time
  payload: GameSnapshot
}
```

## Snapshot nghiệp vụ

| Nhóm | Nội dung |
|---|---|
| `version`, `onboarded`, `tutorialStep` | Phiên bản và tiến trình mở đầu |
| `player` | Tên, màu áo, tuổi, tiền, XP, level, kỹ năng, uy tín |
| `world` | Ngày, phút trong ngày, thời tiết, tốc độ, pause, RNG seed |
| `business` | Quầy, sở hữu/mở bán, giá, giá vốn, tồn kho, chất lượng, uy tín, nhân viên, marketing |
| `dayStats`, `lifetime` | Thống kê ngày và trọn đời |
| `story` | Tình huống đang chờ, history, phút lần trước, số đã xử lý trong ngày |
| `noticeSeq`, `notices` | Thông báo và bộ đếm ID |

Các trường chính xác nằm ở `src/domain/types.ts`; defaults ở `src/store/initialState.ts`. Không lưu actions, đối tượng Phaser, timer hay event listener. `snapshotFromStore()` clone phần dữ liệu.

## Luồng hiện tại và lỗi B01

`useGameRuntime()` load → `hydrate()` → bật tick/autosave. Autosave mỗi 5 giây, khi visibility hidden và khi cleanup.

`hydrate()` nhận version 1/2, merge defaults và đưa về version 2, ép paused=false. Tuy nhiên `loadGame()` hiện chỉ trả payload.version=1. Vì game mới là v2, save mới bị loại trước hydrate. Khi được trả null, runtime coi là game mới và có thể ghi đè slot sau đó. Chưa có migration service, validation đầy đủ hoặc backup.

Version 1 thực tế có thể thiếu `story` mặc dù interface hiện tại yêu cầu trường này. Dùng fixture theo cấu trúc lịch sử, không cast tùy tiện dữ liệu v1 thành v2 để coi đã kiểm thử migration.

## Quy trình cần dùng khi sửa schema

1. Ghi cấu trúc cũ/mới và defaults cho từng trường thêm.
2. Đọc/validate envelope và payload trước khi hydrate; phân biệt không có save với save hỏng/không hỗ trợ.
3. Giữ bản gốc có thể khôi phục trước khi chuyển đổi hoặc ghi đè.
4. Migration là hàm dữ liệu riêng; có test bằng fixture v1, v2 và dữ liệu lỗi.
5. Migration thành công mới cho phép autosave ghi dạng mới. Thiết kế rõ cách xử lý thất bại, không reset âm thầm.
6. Thêm round-trip test qua Dexie/fake-indexeddb và reload trình duyệt, bao gồm story đang chờ và RNG seed.
7. Cập nhật tài liệu này, STATUS và changelog.

Các mục trên là quy trình đề xuất để triển khai, không phải chức năng đã có. Export/import, backup, recovery, offline catch-up và khóa nhiều tab chưa được triển khai trong mã đối chiếu.
