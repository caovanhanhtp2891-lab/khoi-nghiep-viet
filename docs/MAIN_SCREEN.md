# Màn hình chính và thao tác nhanh

## Mục tiêu và bố cục

Bốn hàng: HUD thời gian/nhân vật/tiền, khu phố co giãn, thanh quầy, điều hướng sáu mục. Không đặt thanh nhập hàng hay thẻ số liệu nổi lên khu phố. TopHud có pause/continue và tốc độ luân phiên 1→2→4; mỗi lần chọn tốc độ vẫn tiếp tục thời gian theo setSpeed hiện hữu. Trạng thái lưu lỗi cần theo dõi riêng; autosave không đổi.

MainActions.tsx lấy state từ gameStore, không dùng RNG hay đồng hồ thật. Chưa mua quầy: nút Chọn nghề mở Kinh doanh. Đã có quầy: hiện trạng thái, doanh thu, lãi tạm tính, kho và ba thao tác. Lãi tạm chưa có phí chưa quyết toán, xem Báo cáo để đối soát ngày.

| Thao tác | Điều kiện | Hiệu quả |
|---|---|---|
| Mở bán | Đã sở hữu, trong ca, còn hàng | toggleBusiness; không bán tức thì |
| Đóng quầy | Quầy mở, kể cả ngoài ca | Đổi trạng thái mở |
| Nhập hàng | Có chỗ và đủ tiền cho cả lượng nhập | min(RESTOCK_QUANTITY=20, chỗ trống), trừ tiền và ghi stockPurchases |
| Quản lý | Đã sở hữu | Mở bảng Kinh doanh |

Nút thiếu tiền/đầy kho/outside ca disabled; chi phí và ca nằm trên nút, không phải tooltip duy nhất. Đây là nhập bằng tay, chưa automation. Giao lưu, đơn và thi đua vẫn trong Cư dân.

## Chi tiết tương tác

- GamePanel tự focus nút đóng, giữ Tab/Shift-Tab trong phần tử đang hiện, Escape đóng và trả focus.
- StoryChoiceCard giữ lựa chọn đến xử lý, max-height theo stage và cuộn riêng. NoticeToast vẫn 1.000ms.
- Chạm vỉa hè để đi; chạm NPC để mở hồ sơ. Tìm nhân vật ở góc phải, kích thước44px.
- Không đổi schema hay phiên bản; tiến độ v6 giữ nguyên. Không xóa save để kiểm thử.

## Kiểm tra

Chạy lint, generator120SVG +64 test/8 file, TypeScript/build. Kiểm tra live 320×568/390×740/430×844; trạng thái không tràn, nút nhập/giờ, quầy, mở bảng/đóng Escape, chat composer và reload giữ tiền/hàng/quan hệ. Bằng chứng và mốc cuối trong STATUS.md; iframe chỉ kiểm tra CSS, chưa đo bàn phím/safe area/hiệu năng điện thoại thật.
