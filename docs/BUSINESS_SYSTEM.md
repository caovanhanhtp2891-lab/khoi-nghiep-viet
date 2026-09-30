# Nghề kinh doanh và quyết toán ngày

Ngày 30/09/2026. Payload v5; phát triển từ `5b95a9bfbedc9001e3c0b9e7cf8c30c1513ff23e`. Các mức tiền là cấu hình kinh tế hư cấu của game, chưa phải cân bằng sản phẩm cuối cùng.

## Ba nghề

`src/domain/careers.ts` là nguồn cấu hình giá, giá vốn, ca bán, cao điểm, công suất, weather và hình quầy. Chưa nhiều quầy đồng thời; ba nghề là ba lựa chọn cho một quầy.

| Nghề | Dụng cụ | 20 nguyên liệu | Tổng bắt đầu | Giá / giá vốn | Ca bán | Công suất solo/nhân viên |
|---|---:|---:|---:|---|---|---|
| Xôi | 320.000 | 160.000 | 480.000 | 22.000 / 8.000 | 05:30–10:00 | 2 / 5 |
| Bánh mì | 420.000 | 180.000 | 600.000 | 25.000 / 9.000 | 05:30–14:00 | 3 / 7 |
| Trà sữa | 580.000 | 220.000 | 800.000 | 32.000 / 11.000 | 10:00–22:00 | 2 / 5 |

Bánh mì cao điểm sáng/trưa; trà sữa cao điểm 14–18h và hệ số ngày nóng 1,45. Xôi giữ mô hình trước, mưa 0,58. Mái che nâng hệ số mưa lên ít nhất 0,78 cho mọi nghề. Ngoài ca không mở bán; hết ca tự đóng. Tick 2 giây =5 phút tại 1× không đổi.

## Chọn và đổi nghề

Người mới chọn cả ba nghề miễn phí trước khi mua quầy; chỉ mua mới trừ tổng dụng cụ +20 nguyên liệu. Người đã có quầy thấy bảng chi phí trước nút đổi. Thu hồi dụng cụ cũ bằng 50% giá thiết lập và hàng tồn bằng giá vốn; trừ dụng cụ mới +20 nguyên liệu mới. Nếu thu hồi nhiều hơn cần mua, nhận lại chênh lệch; chu kỳ đổi không tạo thêm tiền vì dụng cụ mất 50% giá.

Phải đóng quầy, không có đơn cư dân hay story đang chờ. Giữ nhân viên, uy tín, chất lượng và upgrade portable; giá bán về mặc định nghề mới, maxInventory về cấu hình nghề +30 nếu có tủ. Chỉ nhận lại vốn nguyên liệu, không biến hoàn vốn thành doanh thu hoặc khách bán. Action giao dịch nằm trong store, scene chỉ vẽ quầy theo nghề/upgrade.

## Đơn cư dân

`dailyOrders(day, careerId)` vẫn 3 đề nghị mỗi ngày, id ngày giữ nguyên để không nhân đơn bằng cách đổi nghề. Giá mỗi đề nghị là giá mặc định nghề −2k/0/+2k; product/đơn vị theo nghề. ActiveOrder lưu careerId; không đổi nghề khi active. Giao đủ hàng trừ giá vốn và cộng doanh thu theo quote; bấm lặp không thanh toán lần hai. v4 active order chuyển sang xoi và giữ số lượng/giá cũ.

## Hai loại sổ

`dayStats` thêm cashOpening, stockPurchases, capitalPurchases, recoveries, communityRewards, careerIds.

- Lợi nhuận = revenue − cogs hàng đã bán − expenses − tiền thuê − lương.
- Dòng tiền đóng = cashOpening + revenue + recoveries + communityRewards − stockPurchases − capitalPurchases − expenses − tiền thuê − lương.
- Mua nguyên liệu trả tiền ngay nhưng chỉ ghi giá vốn khi bán. Dụng cụ không vào profit; đây là mô hình đơn giản chưa có khấu hao tài sản.
- Upgrade, marketing, phí tuyển và hỗ trợ story vào expenses; thưởng milestone vào communityRewards, không phải doanh thu.
- Tiền thuê 35.000/ngày khi có quầy; một nhân viên lương theo business.dailySalary (mặc định 120.000). Lương trọn ngày, không tính theo giờ tuyển.

`accounting.ts` tạo sổ mới và báo cáo/đối soát. `simulateTick()` chốt ngày cũ trước reset, ghi report rồi trừ fee một lần; thêm lifetime.profit/daysCompleted, giữ kho. `reports` tối đa 30 ngày, theo thứ tự tăng dần. Ngày mới luôn đóng quầy. Tick bán hết hàng vẫn ghi khách đến nhưng không phục vụ được; không tạo tồn âm.

## Kết thúc ngày sớm

Trong tab Báo cáo: nút hiển thị phí, đóng quầy và bỏ qua phần thời gian còn lại để tới 05:30 ngày kế. Không mô phỏng doanh thu phần bị bỏ qua. Không dùng khi có đơn/story chờ. Gọi simulateTick một lần vượt mốc ngày, giữ pause/speed và tạo đúng một report. Đây là thao tác chủ động, không phải offline progress. Tick chỉ nhận bước nguyên dương ≤1.440 phút để tránh quyết toán nhiều ngày thiếu phí.

## Migration và kiểm tra

v1–v4 gán careerId xoi, giữ economy/nhân vật/NPC. Không đoán dòng tiền quá khứ: cashOpening=null và report trước đó không được tự dựng; từ ngày kế có đầy đủ. v5 validate career, unitCost/giá, đơn cùng nghề, sổ và report với công thức profit. Snapshot xuất reports. IndexedDB/envelope không đổi.

41 test/6 file bao gồm nghề/ca/thời tiết, đổi nghề/thu hồi/chặn đơn, full ca có restock/marketing/nhân viên/thưởng, boundary tự nhiên, finishDay, cash reconciliation, bounded reports, v4 migration và IndexedDB round-trip. Lint/build pass cục bộ. Kết quả live cập nhật trong STATUS.md. Chưa benchmark thiết bị thật hoặc cân bằng ba nghề qua nhiều tuần.
