# KẾ HOẠCH XÂY DỰNG GAME “KHỞI NGHIỆP VIỆT”

> **Tên làm việc:** Khởi Nghiệp Việt – Từ 1 Triệu Đến Tỷ Phú
> **Thể loại:** Web game mô phỏng kinh doanh, cuộc sống và đầu tư
> **Góc nhìn:** 2D isometric/top-down nghiêng, phong cách cartoon Việt Nam
> **Nền tảng ưu tiên:** Mobile web/PWA; sau đó đóng gói Android/iOS bằng Capacitor
> **Tài liệu này là:** Product plan + game design plan + technical plan + delivery roadmap
> **Trạng thái:** Bản kế hoạch nền tảng v1.0
> **Ngôn ngữ sản phẩm đầu tiên:** Tiếng Việt
> **Nguyên tắc cốt lõi:** Đây là một thế giới kinh tế tự vận hành, không phải game clicker “bấm để nhận tiền”.

---

## 1. Tóm tắt điều hành

Người chơi bắt đầu ở tuổi 18 với **1.000.000 VNĐ**, chưa có doanh nghiệp, nhà ở hay nhân viên. Họ tự lao động trong những nghề nhỏ, tích lũy vốn, mở cửa hàng, thuê nhân viên, xây chuỗi, thành lập công ty và dần tham gia các thị trường lớn như bất động sản, vàng, chứng khoán và tài sản số hư cấu.

Giá trị khác biệt của game nằm ở bốn điểm:

1. **Bối cảnh Việt Nam rõ nét:** phố xá, biển hiệu, xe cộ, nhịp sống, ngày lễ, ngành nghề và hành vi tiêu dùng quen thuộc.
2. **Mô phỏng có nguyên nhân:** khách hàng, doanh thu và giá tài sản thay đổi do thời gian, vị trí, thời tiết, chất lượng, giá bán, marketing, cạnh tranh và sự kiện.
3. **Thế giới vẫn sống khi người chơi không thao tác:** NPC đi lại, cửa hàng vận hành, đối thủ ra quyết định, thị trường biến động và tin tức xuất hiện.
4. **Nhiều con đường thành công:** bán lẻ, F&B, logistics, sản xuất, bất động sản, tài chính hoặc mô hình hỗn hợp đều có thể dẫn tới đế chế lớn.

Tầm nhìn đầy đủ là rất lớn. Vì vậy sản phẩm phải được phát triển theo các lớp độc lập. Bản đầu tiên chỉ cần chứng minh được cảm giác “một cửa hàng thật đang hoạt động trong một khu phố sống”, rồi mới mở rộng sang thành phố, đầu tư, tập đoàn và online world.

---

## 2. Quyết định sản phẩm nền tảng

### 2.1 Các quyết định đã chốt trong kế hoạch

| Chủ đề | Quyết định |
|---|---|
| Người chơi khởi đầu | 18 tuổi, 1.000.000 VNĐ, ở phòng trọ cơ bản |
| Nhịp thời gian mặc định | 2 giây thật = 5 phút game; 1 ngày game = 9 phút 36 giây thật |
| Trạng thái thời gian | Có tạm dừng, tốc độ x1, x2 và x4; một số tình huống khóa tăng tốc |
| Kiểu mô phỏng | Tick cố định, logic mô phỏng tách khỏi phần hiển thị Phaser |
| Tiền tệ | Số nguyên VNĐ, không dùng số thực để tránh sai số |
| Góc nhìn | 2D isometric/top-down nghiêng, mobile-first |
| Lưu bản đầu | IndexedDB; LocalStorage chỉ lưu cài đặt nhỏ |
| Multiplayer | Không có trong MVP; chuẩn bị kiến trúc để bổ sung sau |
| Thị trường đầu tư | Dùng tài sản/công ty hư cấu; không sao chép giá thật theo thời gian thực |
| Kiếm tiền | Không pay-to-win; ưu tiên mỹ phẩm, gói tiện ích hợp lý và nội dung mở rộng |
| Quyền quyết định kinh tế | Khi online, server phải là nguồn dữ liệu có thẩm quyền |

### 2.2 Những điều tuyệt đối không làm

- Không biến hoạt động kinh doanh thành một nút “Bán” cộng tiền ngay lập tức.
- Không mở toàn bộ 40+ hệ thống ngay từ ngày đầu.
- Không cho quảng cáo hoặc vật phẩm trả phí phá vỡ cân bằng kinh tế.
- Không dùng tài sản số hư cấu theo cách khiến người chơi hiểu nhầm là đầu tư tiền thật.
- Không cho client tự quyết định số dư, giao dịch hay leaderboard khi đã có multiplayer.
- Không mô phỏng từng NPC trên toàn quốc theo từng khung hình; phải dùng nhiều cấp độ chi tiết.
- Không bắt người chơi mất toàn bộ công sức chỉ vì tuổi già, phá sản hoặc bỏ game một thời gian.

---

## 3. Mục tiêu, đối tượng và trụ cột trải nghiệm

### 3.1 Đối tượng chính

- Người Việt 15+ yêu thích game tycoon, quản lý, idle có chiều sâu hoặc life simulation.
- Người chơi mobile có phiên chơi ngắn 5–15 phút nhưng muốn tiến trình kéo dài nhiều tháng.
- Người thích tối ưu vận hành, theo dõi số liệu, khám phá thị trường và cạnh tranh gián tiếp.
- Người không chuyên kinh tế vẫn phải hiểu game sau 10 phút đầu.

### 3.2 Trụ cột thiết kế

**Trụ cột A – Khởi nghiệp từ con số nhỏ**
Mỗi bước phát triển phải tạo cảm giác có ý nghĩa: tự bán suất đầu tiên, thuê nhân viên đầu tiên, có cửa hàng đầu tiên và mở chi nhánh đầu tiên.

**Trụ cột B – Kinh tế có thể đọc và dự đoán**
Biến động không được hoàn toàn ngẫu nhiên. Người chơi phải có thể đọc dự báo, tin tức, dữ liệu khu vực và báo cáo kinh doanh để ra quyết định tốt hơn.

**Trụ cột C – Việt Nam sống động**
Môi trường, lịch sinh hoạt, ngành nghề, ngày lễ, phương tiện và lời thoại đều tạo cảm giác bản địa nhưng không dùng thương hiệu thật khi chưa có quyền.

**Trụ cột D – Nhiều chiến lược, không một đáp án**
Giá rẻ, chất lượng cao, vị trí tốt, tốc độ phục vụ, thương hiệu mạnh hoặc vận hành quy mô đều có thể là chiến lược hợp lệ.

**Trụ cột E – Tiến trình dài nhưng tôn trọng thời gian**
Offline progress có giới hạn hợp lý, thao tác lặp được tự động hóa dần, và người chơi giàu chuyển từ lao động trực tiếp sang quản trị.

### 3.3 Chỉ số thành công sản phẩm

Các mục tiêu sau là mục tiêu đo lường sau khi có bản beta, không phải cam kết trước khi có dữ liệu:

- Ít nhất 70% người mới hoàn thành tutorial và bán được đơn hàng đầu tiên.
- Ít nhất 50% người mới mở được quầy kinh doanh đầu tiên trong phiên đầu.
- Thời gian tới “niềm vui đầu tiên” dưới 5 phút.
- Người chơi hiểu được chênh lệch giữa doanh thu, chi phí và lợi nhuận sau ngày game đầu tiên.
- Không có một nghề duy nhất chiếm trên 35% lựa chọn ở cùng một giai đoạn tiến trình.
- Crash-free session từ 99,5% trở lên ở bản phát hành ổn định.
- Mô phỏng không sai lệch số dư qua save/load, offline progress hoặc thay đổi tốc độ thời gian.

---

## 4. Vòng lặp gameplay

### 4.1 Vòng lặp từng phút

1. Quan sát thời gian, thời tiết, lượng khách và hàng tồn.
2. Chuẩn bị nguyên liệu, mở quầy/cửa hàng và đặt giá.
3. Phục vụ hoặc phân công nhân viên.
4. Xử lý vấn đề: thiếu hàng, hàng chờ dài, máy hỏng, mưa, đối thủ khuyến mãi.
5. Nhận phản hồi trực quan: khách mua, bỏ đi, đánh giá, doanh thu và lợi nhuận tạm tính.
6. Điều chỉnh vận hành trong ngày.

### 4.2 Vòng lặp một ngày game

1. Đọc dự báo và tin tức buổi sáng.
2. Lập kế hoạch nhập hàng, lịch nhân viên, giờ mở cửa và marketing.
3. Vận hành trong các khung giờ cao điểm/thấp điểm.
4. Đóng cửa, thanh toán chi phí, lương/thuế đến hạn.
5. Xem báo cáo cuối ngày và nguyên nhân tăng/giảm.
6. Quyết định tái đầu tư, tiết kiệm, vay hoặc mở rộng.

### 4.3 Vòng lặp trung hạn

**Kiếm tiền → tích vốn → nâng cấp → tự động hóa → mở ngành/địa điểm mới → tối ưu danh mục → đối đầu cạnh tranh → tăng tài sản ròng.**

### 4.4 Vòng lặp dài hạn

- Giai đoạn lao động: người chơi trực tiếp làm hầu hết công việc.
- Giai đoạn chủ quầy: thuê 1–3 nhân viên và bắt đầu quản lý.
- Giai đoạn chủ cửa hàng: tối ưu mặt bằng, thương hiệu, chuỗi cung ứng.
- Giai đoạn chủ chuỗi: dùng quản lý vùng, dashboard và quy trình chuẩn.
- Giai đoạn doanh nghiệp: tài chính doanh nghiệp, logistics, nhà máy, M&A.
- Giai đoạn tập đoàn: phân bổ vốn giữa nhiều ngành và nhiều khu vực.
- Giai đoạn di sản: chuyển giao cho thế hệ sau hoặc tiếp tục nhân vật hiện tại theo lựa chọn thiết kế.

---

## 5. Trải nghiệm 30 phút đầu

### 5.1 Màn hình mở đầu

Hiển thị thông điệp:

> **18 tuổi. 1.000.000 đồng. Không tài sản. Không công ty.**
> **Bạn sẽ mất bao lâu để trở thành người giàu nhất Việt Nam?**

### 5.2 Tạo nhân vật tối giản cho MVP

- Họ tên.
- Nam/Nữ hoặc tùy chọn không muốn xác định; thiết kế dữ liệu không khóa cứng hai lựa chọn.
- 6 khuôn mặt, 6 kiểu tóc, 8 bộ trang phục, 6 tông da.
- Quê quán; bản đầu chỉ ảnh hưởng một số thoại/hồ sơ, không tạo lợi thế kinh tế.
- Nút random và xem trước animation đứng/đi.

### 5.3 Tutorial có ngữ cảnh

1. Nhận phòng trọ và xem số dư 1.000.000 VNĐ.
2. Đi tới chợ/khu cung ứng.
3. Chọn một trong ba con đường được hướng dẫn: xôi, bánh mì hoặc nước mía.
4. Mua dụng cụ và nguyên liệu với một gói khởi đầu gợi ý.
5. Chọn vị trí hợp lệ và mở bán.
6. Tự phục vụ ba khách đầu tiên bằng thao tác ngắn, không phải spam click.
7. Xem nguyên liệu giảm, tiền tăng và khách đánh giá.
8. Đóng phiên bán và xem báo cáo lãi/lỗ.
9. Nhận nhiệm vụ mở: tự chọn nâng cấp, đổi giá hoặc tiết kiệm thuê nhân viên.

### 5.4 Mục tiêu cảm xúc

- Phút 1–3: tò mò và hiểu bối cảnh.
- Phút 3–7: có giao dịch đầu tiên.
- Phút 7–15: thấy rõ giờ cao điểm, hàng chờ và yếu tố vị trí.
- Phút 15–25: ra quyết định kinh tế đầu tiên có đánh đổi.
- Phút 25–30: thấy mục tiêu kế tiếp và muốn quay lại ngày sau.

---

## 6. Phạm vi phiên bản đầu tiên

### 6.1 Vertical Slice – bản chứng minh trải nghiệm

Vertical Slice phải chơi được từ đầu tới hết 7 ngày game, gồm:

- 1 khu phố hoàn chỉnh, chia thành khu trường học, khu dân cư và chợ nhỏ.
- 1 nhân vật có tạo hình cơ bản và các animation: đứng, đi, chạy, bán hàng, bê hàng, dùng điện thoại.
- Chu kỳ ngày/đêm, đồng hồ, tạm dừng và tốc độ x1/x2/x4.
- 4 kiểu thời tiết: nắng, nhiều mây, mưa, nắng nóng.
- 3 nghề: xôi, bánh mì, nước mía.
- 4 phân khúc khách: học sinh, công nhân, cư dân, nhân viên văn phòng.
- Hệ thống vị trí, nhu cầu, giá, chất lượng, hàng chờ và tồn kho.
- Tự làm việc; thuê được 1 loại nhân viên bán hàng.
- Báo cáo cuối ngày, nhiệm vụ hướng dẫn, save/load IndexedDB.
- 10 sự kiện nhỏ, 20 câu chat NPC, 1 leaderboard giả lập cục bộ.

**Tiêu chí thoát Vertical Slice:** người thử nghiệm có thể giải thích vì sao cửa hàng lời/lỗ và muốn thử lại bằng một chiến lược khác.

### 6.2 MVP – bản có thể phát hành thử nghiệm

MVP mở rộng thành:

- 1 khu phố lớn hoặc 3 khu nhỏ có đặc tính khác nhau.
- 5 nghề: vé số, xôi, bánh mì, nước mía, trà sữa.
- 8–12 sản phẩm và công thức nguyên liệu.
- 6 phân khúc khách, tối thiểu 30 biến thể hình ảnh NPC.
- 5 vai trò nhân viên: bán hàng, thu ngân, pha chế/nấu, giao hàng, quản lý.
- Kỹ năng nhân vật, level 1–15, danh tiếng, review và marketing cơ bản.
- Nhà trọ, xe đạp, xe máy phổ thông và các nâng cấp có tác dụng thật.
- 5 loại thời tiết, dự báo ngày mai và 40 sự kiện.
- 30 nhiệm vụ hướng dẫn/tùy chọn, 25 thành tựu.
- Dashboard tài chính, nhật ký giao dịch và biểu đồ 7/30 ngày.
- Offline progress tối đa 8 giờ thật ở mức 100%; phần vượt quá áp dụng hiệu suất giảm hoặc không tính.
- Bot chat cục bộ, boss kinh doanh cơ bản và leaderboard NPC.
- PWA, cài lên màn hình chính, autosave, export/import save.
- Telemetry có sự đồng ý, xử lý lỗi và công cụ cân bằng dữ liệu.

### 6.3 Ngoài phạm vi MVP

- Multiplayer thời gian thực và chat người thật.
- Tài khoản, cloud save và marketplace.
- Chứng khoán, vàng, tiền số, bất động sản hoàn chỉnh.
- Nhà máy, tập đoàn, M&A, niêm yết, quốc tế.
- Mô phỏng toàn bộ tỉnh/thành Việt Nam.
- Thế hệ thứ hai hoàn chỉnh.
- Nội dung do người chơi tự tạo.

Những mục này vẫn có dữ liệu/ranh giới kiến trúc dự phòng nhưng không được làm chậm MVP.

---

## 7. Đặc tả hệ thống thời gian

### 7.1 Mô hình thời gian

- `1 time unit = 1 phút game`.
- Ở tốc độ x1, 5 phút game trôi qua sau 2 giây thật.
- Logic mô phỏng chạy theo tick 1 phút game; renderer có thể nội suy để chuyển động mượt.
- Đồng hồ dùng lịch game riêng, không phụ thuộc trực tiếp vào đồng hồ hệ điều hành sau khi phiên chơi đã bắt đầu.
- Mọi timestamp lưu dưới dạng số phút kể từ epoch của thế giới game.

### 7.2 Trạng thái điều khiển

- Pause: dừng simulation, không dừng UI/animation nền cần thiết.
- x1: tốc độ chuẩn.
- x2: dùng khi chờ giờ cao điểm.
- x4: chỉ mở sau tutorial; tự hạ tốc khi có quyết định quan trọng.
- Khi tab nền, dừng vòng render và chuyển sang tính bù bằng timestamp an toàn.

### 7.3 Lịch

- 365 ngày game = 1 tuổi.
- Có ngày trong tuần, tháng, mùa và ngày lễ.
- Tết âm lịch cần bảng lịch nội bộ theo “năm thế giới” hoặc quy tắc nội dung, không phụ thuộc tuyệt đối vào lịch thật.
- Bản MVP chỉ cần một năm lịch lặp có trọng số mùa; bản sau mới thêm nhiều năm với kinh tế vĩ mô.

### 7.4 Quy tắc determinism

- Mỗi thế giới có `worldSeed`.
- Random theo từng hệ thống dùng seed nhánh: thời tiết, sự kiện, khách, đối thủ.
- Cùng state + cùng seed + cùng input phải cho cùng kết quả.
- Điều này bắt buộc để tái hiện bug, kiểm thử offline và chống sai số save/load.

---

## 8. Thời tiết, mùa và môi trường

### 8.1 Trạng thái thời tiết

| Thời tiết | Ảnh hưởng chính | Phản ứng có thể chuẩn bị |
|---|---|---|
| Nắng | Lưu lượng bình thường | Vận hành tiêu chuẩn |
| Nhiều mây | Gần trung tính | Không cần chuẩn bị lớn |
| Mưa | Giảm người đi bộ, tăng giao hàng | Mái che, giao hàng, món nóng |
| Mưa lớn | Giảm mạnh khách tại chỗ, giao hàng chậm | Tạm đóng quầy yếu, tăng dự phòng |
| Nắng nóng | Tăng đồ lạnh, tăng điện | Tồn kho nước/đá, điều hòa tốt |
| Gió mạnh | Quầy ngoài trời giảm hiệu quả | Nâng cấp quầy/mái che |
| Sương mù | Di chuyển chậm, ít khách sớm | Dời giờ mở cửa hoặc khuyến mãi |

### 8.2 Sinh thời tiết

- Dùng Markov chain theo mùa/khu vực: thời tiết ngày sau phụ thuộc thời tiết hôm nay và mùa.
- Dự báo ngày mai có độ chính xác 70–95% tùy cấp dịch vụ/kỹ năng; dự báo không được nói sai theo cách vô lý.
- Hiệu ứng thời tiết chia làm ba lớp: hình ảnh, âm thanh và hệ số mô phỏng.
- Không spawn hạt mưa cho toàn bản đồ; chỉ render trong camera và giới hạn theo thiết bị.

### 8.3 Tác động minh bạch

Dashboard phải giải thích được ví dụ: “Khách vãng lai -18% vì mưa”, “Nhu cầu đồ uống lạnh +22% vì nắng nóng”. Người chơi không cần biết toàn bộ công thức nhưng phải hiểu nguyên nhân chính.

---

## 9. Khu vực, bản đồ và bất động sản mặt bằng

### 9.1 Cấu trúc không gian

```text
Quốc gia
└── Tỉnh/Thành phố
    └── Quận/Huyện
        └── Phường/Xã
            └── Khu phố
                └── Ô đất/Mặt bằng/Điểm bán
```

MVP chỉ hiện thực `Khu phố → Ô đất/Điểm bán`, nhưng ID và schema phải hỗ trợ các tầng cao hơn.

### 9.2 Thuộc tính khu vực

- Dân số mô phỏng và cơ cấu phân khúc.
- Thu nhập trung vị và ngân sách chi tiêu.
- Lưu lượng theo từng khung 30 phút.
- Điểm hút khách: trường học, chợ, khu công nghiệp, bến xe, văn phòng.
- Giá thuê, giá đất, chi phí điện nước và mức cạnh tranh.
- An ninh, độ sạch, giao thông và khả năng tiếp cận.
- Danh sách sự kiện/nhu cầu đặc thù.

### 9.3 Thuộc tính điểm kinh doanh

- ID ô đất, tọa độ, diện tích hữu dụng.
- Loại mặt bằng: vỉa hè, ki-ốt, nhà phố, trung tâm thương mại, đất trống.
- Giá thuê/giá mua, tiền cọc, thời hạn hợp đồng.
- Lưu lượng cơ sở, độ nhìn thấy, chỗ đỗ xe, mái che.
- Giới hạn loại hình, công suất, giờ hoạt động và tiếng ồn.
- Chủ sở hữu, người thuê, lịch sử giá và quy hoạch.

### 9.4 Cấp độ chi tiết

- Trong camera: NPC thật, hàng chờ, chuyển động và animation.
- Cùng khu nhưng ngoài camera: mô phỏng nhóm theo mỗi 5 phút game.
- Khu khác: mô phỏng tổng hợp theo mỗi 30–60 phút game.
- Tỉnh khác/quốc tế: batch theo ngày game.

---

## 10. Khách hàng và nhu cầu

### 10.1 Hồ sơ khách hàng

Mỗi archetype có:

- Tuổi/nhóm tuổi, nghề nghiệp, thu nhập và ngân sách mỗi chuyến.
- Lịch sinh hoạt, tốc độ di chuyển và phương tiện.
- Sở thích sản phẩm, độ nhạy giá, yêu cầu chất lượng.
- Độ kiên nhẫn, mức đói/khát, tâm trạng.
- Mức trung thành với thương hiệu và lịch sử trải nghiệm rút gọn.

Không lưu toàn bộ lịch sử của mọi NPC vãng lai. Chỉ NPC “đáng nhớ” hoặc khách trung thành mới có persistent identity; phần còn lại được sinh từ archetype.

### 10.2 Sinh nhu cầu

Lượng khách tiềm năng trong một khoảng thời gian:

```text
potentialTraffic = baseFootTraffic
                 × timeOfDayFactor
                 × weekdayFactor
                 × weatherFactor
                 × eventFactor
                 × areaGrowthFactor
```

Mức hấp dẫn của một cửa hàng với một khách:

```text
utility = productFit
        + qualityScore
        + brandScore
        + marketingAwareness
        + loyaltyBonus
        - pricePenalty
        - distancePenalty
        - waitPenalty
        - badReviewPenalty
```

Xác suất chọn cửa hàng dùng softmax giữa các lựa chọn gần đó, cộng lựa chọn “không mua”. Nhờ vậy cạnh tranh xảy ra tự nhiên và tổng khách không bị nhân lên khi có thêm cửa hàng.

### 10.3 Hành trình khách

1. Nhu cầu được kích hoạt.
2. Khách xác định tập cửa hàng có thể tiếp cận.
3. So sánh utility và chọn địa điểm.
4. Di chuyển, vào hàng chờ.
5. Được phục vụ hoặc bỏ đi nếu quá kiên nhẫn.
6. Thanh toán, tiêu dùng và đánh giá.
7. Cập nhật mức hài lòng/trung thành.

### 10.4 Hàng chờ và công suất

- Mỗi trạm phục vụ có `serviceRate` theo nhân viên, thiết bị và sản phẩm.
- Khách có `patienceMinutes`.
- Nếu thời gian chờ dự kiến vượt kiên nhẫn, khách có thể bỏ đi trước khi xếp hàng.
- Nếu đang chờ quá lâu, khách rời hàng và tạo phản hồi xấu nhẹ.
- Dashboard hiển thị số khách mất do thiếu công suất để người chơi biết cần nâng cấp gì.

---

## 11. Kinh doanh, sản phẩm và tồn kho

### 11.1 Chu trình một doanh nghiệp

`Chuẩn bị → nhập hàng → bố trí nhân lực → mở cửa → thu hút khách → phục vụ → ghi nhận giao dịch → đóng cửa → quyết toán → bảo trì`.

### 11.2 Định nghĩa ngành nghề

Mỗi `BusinessDefinition` phải là dữ liệu cấu hình, không hard-code:

- Điều kiện mở khóa, vốn khuyến nghị, dụng cụ bắt buộc.
- Loại mặt bằng hợp lệ và giờ cầu cao.
- Danh sách sản phẩm/công thức.
- Vai trò nhân viên, trạm làm việc và công suất.
- Hệ số thời tiết, sự kiện, khu vực, phân khúc.
- Chi phí cố định/biến đổi, rủi ro và nâng cấp.
- Asset hình ảnh/animation/âm thanh.

### 11.3 Năm nghề của MVP

| Nghề | Vai trò gameplay | Điểm mạnh | Rủi ro chính |
|---|---|---|---|
| Vé số | Vốn rất thấp, di chuyển | Dễ bắt đầu | Biên lợi nhuận thấp, phụ thuộc lưu lượng |
| Xôi | Bán sáng | Quay vòng nhanh | Tồn hàng hỏng sau buổi sáng |
| Bánh mì | Nhiều khung giờ | Tệp khách rộng | Công thức/tốc độ phục vụ phức tạp hơn |
| Nước mía | Mạnh khi nóng | Biên tốt lúc cao điểm | Nhạy thời tiết, cần thiết bị |
| Trà sữa | Mở khóa muộn hơn | Thương hiệu/marketing mạnh | Vốn, thuê mặt bằng, cạnh tranh cao |

Các con số cân bằng phải đặt trong file dữ liệu và được điều chỉnh qua playtest, không khóa vào tài liệu này.

### 11.4 Tồn kho

- Nguyên liệu có đơn vị, giá vốn, hạn sử dụng và điều kiện bảo quản.
- Dùng phương pháp giá vốn bình quân gia quyền trong MVP.
- Công thức trừ nguyên liệu khi bắt đầu chế biến hoặc khi bán tùy loại sản phẩm.
- Thiếu một nguyên liệu bắt buộc thì sản phẩm tạm hết hàng.
- Hàng hỏng tạo chi phí hủy và có thể ảnh hưởng vệ sinh nếu không xử lý.
- Có mức tồn tối thiểu và đơn đặt tự động sau khi mở khóa quản lý.

### 11.5 Định giá

- Người chơi chọn giá trong khoảng hợp lý; cảnh báo nếu dưới giá vốn hoặc quá xa thị trường.
- Độ nhạy giá khác nhau theo phân khúc và khu vực.
- Thay đổi giá quá thường xuyên có thể giảm niềm tin nhẹ.
- Khuyến mãi phải ghi rõ ai chịu chi phí và ảnh hưởng tới biên lợi nhuận.

### 11.6 Chất lượng

```text
quality = ingredientQuality
        × recipeCompliance
        × workerSkill
        × equipmentCondition
        × hygieneFactor
```

Điểm chất lượng được chuẩn hóa 0–100, sau đó chuyển thành xác suất hài lòng; không nhân thẳng quá nhiều hệ số khiến kết quả về 0.

---

## 12. Nhân viên và tổ chức

### 12.1 Thuộc tính nhân viên

- Họ tên, avatar, tuổi, vai trò và cấp nghề.
- Lương kỳ vọng, lịch làm việc, kinh nghiệm.
- Tốc độ, chất lượng, bán hàng, thái độ, độ tin cậy.
- Năng lượng, tinh thần, mức hài lòng và trung thành.
- Đặc điểm tính cách/trait: chăm chỉ, khéo giao tiếp, hay đi muộn, học nhanh…
- Lịch sử tăng lương, cảnh cáo, đào tạo và thăng chức.

### 12.2 Vòng đời nhân viên

`Ứng tuyển → phỏng vấn/rút gọn → thử việc → làm việc → đào tạo/đánh giá → tăng lương/thăng chức → nghỉ việc hoặc quản lý lâu dài`.

### 12.3 Công thức hiệu suất

```text
effectivePerformance = baseSkill
                     × roleFit
                     × moraleFactor
                     × energyFactor
                     × equipmentFactor
                     × managerFactor
```

### 12.4 Tinh thần và nghỉ việc

Tinh thần giảm do lương thấp hơn thị trường, quá tải, lịch tệ, quản lý yếu hoặc lương trễ. Nhân viên phải báo dấu hiệu trước khi nghỉ; không dùng sự kiện nghỉ việc hoàn toàn bất ngờ trừ trait/sự kiện đặc biệt.

### 12.5 Tự động hóa theo tiến trình

- Tự làm: người chơi thực hiện thao tác phục vụ chính.
- Có nhân viên: người chơi tiếp tế và xử lý vấn đề.
- Có quản lý: cửa hàng tự lập lịch/đặt hàng theo chính sách.
- Có quản lý vùng: nhiều cửa hàng chạy theo template, người chơi theo dõi ngoại lệ.
- Có giám đốc: người chơi quản lý chỉ tiêu và phân bổ vốn.

---

## 13. Nhân vật, kỹ năng, level và cuộc sống

### 13.1 Chỉ số kỹ năng

| Kỹ năng | Tác dụng chính |
|---|---|
| Kinh doanh | Hiểu báo cáo, bonus nhỏ cho vận hành trực tiếp |
| Đàm phán | Giá mua, thuê và điều khoản tốt hơn trong giới hạn |
| Marketing | Tăng hiệu quả chiến dịch, mở dữ liệu phân khúc |
| Quản trị | Tăng số cơ sở quản lý hiệu quả |
| Đầu tư | Mở thêm thông tin và giảm sai số phân tích, không đảm bảo lợi nhuận |
| Tài chính | Dự báo dòng tiền, điều kiện vay và quản trị vốn |
| Lãnh đạo | Tinh thần, giữ chân và phát triển nhân viên |
| May mắn | Ảnh hưởng nhỏ tới cơ hội hiếm; có trần để tránh phá cân bằng |
| Danh tiếng | Cơ hội gặp đối tác, độ nhận biết cá nhân |
| Uy tín | Điều kiện tín dụng, đàm phán, niềm tin của thị trường |

### 13.2 Tăng kỹ năng

- Học qua hành động có diminishing returns.
- Khóa học/sách/cố vấn tốn tiền và thời gian.
- Nhiệm vụ cột mốc cấp điểm chọn, tránh bắt grind vô hạn.
- Có soft cap theo giai đoạn; không mua thẳng sức mạnh cốt lõi bằng tiền thật.

### 13.3 Level

Level chủ yếu là cổng hướng dẫn nội dung, không phải hệ số sức mạnh toàn cục:

- Lv1: nghề đường phố.
- Lv5: tuyển nhân viên.
- Lv10: thuê cửa hàng.
- Lv15: ngân hàng/vàng cơ bản ở bản mở rộng.
- Lv20: chứng khoán.
- Lv25: bất động sản.
- Lv30: thành lập công ty.
- Lv40: nhà máy.
- Lv50: tập đoàn.
- Lv60+: quốc tế.

Mốc có thể đổi sau playtest; luôn có điều kiện năng lực/tài chính song song để tránh “đủ level là tự nhiên thành công”.

### 13.4 Nhà ở và tài sản cá nhân

Nhà/xe không chỉ là vật trang trí:

- Nhà tốt tăng hồi phục năng lượng, kho cá nhân và một phần danh tiếng.
- Phương tiện giảm thời gian di chuyển, tăng vùng tiếp cận.
- Tài sản xa xỉ mở sự kiện/đối tác nhưng có chi phí bảo trì.
- Người chơi có thể chọn sống tiết kiệm để tái đầu tư; không bắt buộc mua xa xỉ.

### 13.5 Tuổi tác và kế nghiệp

- MVP chỉ tăng tuổi và tạo mốc sinh nhật; chưa có tử vong bắt buộc.
- Bản sau cho chọn: tiếp tục nhân vật, nghỉ hưu mềm, hoặc chuyển sang người kế nghiệp.
- Kế nghiệp giữ doanh nghiệp/tài sản nhưng đổi một phần kỹ năng và quan hệ, tạo New Game+ thay vì xóa tiến trình.

---

## 14. Tài chính, sổ cái và tài sản ròng

### 14.1 Sổ cái kép rút gọn

Mọi thay đổi tiền phải tạo `LedgerEntry`; không cho hệ thống sửa số dư trực tiếp mà không có lý do giao dịch.

Các tài khoản tối thiểu:

- Tiền mặt.
- Tiền ngân hàng.
- Hàng tồn kho.
- Tài sản cố định.
- Khoản phải trả/nợ vay.
- Vốn chủ sở hữu.
- Doanh thu.
- Giá vốn.
- Chi phí vận hành.
- Thuế và lãi vay.

MVP có thể trình bày đơn giản cho người chơi nhưng backend/domain phải giữ dấu vết giao dịch.

### 14.2 Công thức cơ bản

```text
grossProfit = revenue - costOfGoodsSold
operatingProfit = grossProfit - payroll - rent - utilities - marketing - maintenance - otherOperatingCosts
netProfit = operatingProfit - interest - tax + nonOperatingIncome

netWorth = cash
         + bankBalance
         + inventoryValue
         + businessValuation
         + marketAssets
         + realEstateValue
         + personalAssetValue
         - totalDebt
         - outstandingLiabilities
```

### 14.3 Định giá doanh nghiệp

Bản đơn giản dùng kết hợp:

- Giá trị tài sản ròng.
- Lợi nhuận trung bình 30/90 ngày với hệ số ngành.
- Tăng trưởng, thương hiệu, rủi ro và nợ.

Không cho một ngày doanh thu đột biến làm định giá tăng vô hạn; dùng trung bình trượt và winsorization.

### 14.4 Phá sản và chống kẹt tiến trình

- Cảnh báo dòng tiền trước 3–7 ngày game.
- Cho thương lượng nợ, bán tài sản, thu hẹp cơ sở hoặc vay cứu trợ có điều kiện.
- Nếu phá sản, giữ kỹ năng/danh tiếng cá nhân một phần và cho khởi nghiệp lại với gói tối thiểu.
- Không tạo trạng thái save không thể tiếp tục.

---

## 15. Ngân hàng, đầu tư và bất động sản – kế hoạch hậu MVP

### 15.1 Ngân hàng

- Tiền gửi, lãi suất, khoản vay, hạn mức và lịch thanh toán.
- Điểm tín dụng dựa trên thu nhập ổn định, tài sản đảm bảo, nợ hiện tại và lịch sử trả nợ.
- Lãi suất gồm lãi cơ sở + premium rủi ro.
- Trả nợ trễ ảnh hưởng uy tín; vỡ nợ có quy trình chứ không trừ tài sản tức thì thiếu giải thích.

### 15.2 Chứng khoán hư cấu

- Công ty có báo cáo doanh thu, lợi nhuận, nợ, cổ tức và tin tức.
- Giá gồm giá trị cơ bản + chu kỳ ngành + tâm lý + thanh khoản + sự kiện.
- Có mua, bán, giữ, cổ tức, sở hữu lớn và M&A ở late game.
- Không cam kết lợi nhuận, không quy đổi ra tiền thật, có nhãn giải trí rõ ràng.

### 15.3 Vàng

- Vàng nhẫn và vàng miếng hư cấu có spread mua/bán và phí lưu trữ.
- Giá chịu ảnh hưởng lạm phát, khủng hoảng và tâm lý trú ẩn.
- Két cá nhân có giới hạn/rủi ro; ngân hàng có phí giữ hộ.

### 15.4 Tài sản số hư cấu

- Chỉ mở ở giai đoạn sau; biến động cao, có bull/bear, “cá voi”, sàn và sự cố.
- Không dùng logo, tên hoặc feed giá của coin thật nếu chưa có đánh giá pháp lý.
- Không có loot box hoặc cơ chế giống cờ bạc bằng tiền thật.

### 15.5 Bất động sản

- Mỗi lô có vị trí, diện tích, mục đích, lưu lượng, hạ tầng, quy hoạch và lịch sử giá.
- Giá thay đổi theo thu nhập khu vực, cung/cầu, công trình mới, lãi suất, tin tức và đầu cơ.
- Công dụng: cho thuê, kinh doanh, kho, nhà trọ, chung cư, trung tâm thương mại, nhà máy.
- Thông tin quy hoạch có mức chắc chắn; không tạo nội dung ám chỉ thông tin thật ngoài đời.

---

## 16. Đối thủ, boss và AI doanh nhân

### 16.1 Mô hình tác nhân

Mỗi boss có:

- Tính cách: liều lĩnh, thận trọng, phá giá, tích tiền, thích chuỗi, thích đất…
- Mục tiêu: tăng tài sản, thống lĩnh ngành, giữ thanh khoản, thâu tóm.
- Khẩu vị rủi ro và thời hạn đầu tư.
- Khả năng quan sát thị trường không hoàn hảo.
- Lịch sử quyết định và quan hệ với người chơi.

### 16.2 Chu kỳ quyết định

1. Quan sát dữ liệu mà boss được phép biết.
2. Tạo danh sách hành động: đổi giá, marketing, tuyển người, mở/đóng cơ sở, đầu tư.
3. Chấm utility theo mục tiêu và rủi ro.
4. Chọn hành động có yếu tố khám phá nhỏ.
5. Thực thi với cùng quy tắc chi phí/công suất như người chơi.
6. Học từ kết quả bằng thay đổi trọng số giới hạn, không cần ML online ở MVP.

### 16.3 Nguyên tắc công bằng

- Boss không được biết state bí mật của người chơi.
- Boss không được tự sinh tiền ngoài ngân sách, trừ trợ cấp hệ thống được ghi rõ theo tier.
- Nếu cần rubber-banding, chỉ dùng để chọn đối thủ phù hợp chứ không phá luật kinh tế.
- Người chơi phải nhìn thấy nguyên nhân cạnh tranh: khuyến mãi, vị trí, review, chất lượng.

### 16.4 Trí nhớ quan hệ

Lưu các “memory fact” quan trọng: cạnh tranh cùng khu, từng bán/mua tài sản, từng thắng một cuộc đấu giá, từng hợp tác. Lời thoại được sinh từ template có kiểm duyệt; không cần LLM trực tiếp trong gameplay cốt lõi.

---

## 17. Sự kiện, tin tức, ngày lễ và chat NPC

### 17.1 Event Engine

Mỗi sự kiện cấu hình gồm:

- Điều kiện kích hoạt.
- Xác suất/trọng số và cooldown.
- Phạm vi: cá nhân, cửa hàng, khu phố, thành phố, quốc gia.
- Thời gian báo trước, bắt đầu, kéo dài và kết thúc.
- Modifier tác động và đối tượng chịu tác động.
- Lựa chọn của người chơi, chi phí, kết quả và follow-up.
- Tin tức/chat/visual đi kèm.

### 17.2 Loại sự kiện

- Vận hành: mất điện, hỏng máy, thiếu hàng, nhân viên nghỉ.
- Thị trường: nhà cung cấp tăng giá, đối thủ khuyến mãi, xu hướng món mới.
- Danh tiếng: khách nổi tiếng, video viral, đánh giá xấu.
- Vĩ mô: xăng tăng, lãi suất đổi, suy thoái, bùng nổ du lịch.
- Thời tiết: mưa lớn, nắng nóng dài ngày, bão.
- Lịch: Tết, 30/4, 1/5, 2/9, Trung thu, ngày Nhà giáo, Noel, Black Friday.
- Thể thao/văn hóa hư cấu hoặc có quyền sử dụng phù hợp.

### 17.3 Tin tức

Mỗi bản tin phải liên kết tới một hoặc nhiều modifier thật. UI cho phép bấm “Xem ngành bị ảnh hưởng” và hiển thị thời hạn dự kiến. Tin đồn có thể sai nhưng phải được gắn nhãn là tin đồn.

### 17.4 Chat NPC

- Kênh khu phố, kinh doanh, đầu tư và toàn quốc.
- NPC chỉ nói về sự kiện/state đã tồn tại hoặc câu đời thường trung tính.
- Template có biến tên, địa điểm, sản phẩm và mức độ cảm xúc.
- Cooldown, chống lặp, whitelist từ ngữ và không giả mạo người chơi thật.
- Khi có multiplayer, chat NPC phải được đánh dấu để người chơi nhận biết đó là nhân vật game.

---

## 18. Nhiệm vụ, thành tựu và leaderboard

### 18.1 Nhiệm vụ

- Nhiệm vụ đầu game dạy một hành động và giải thích lý do.
- Nhiệm vụ sau tutorial là gợi ý, không ép tuyến.
- Không yêu cầu thao tác vô nghĩa như bấm 100 lần.
- Mỗi nhiệm vụ có progress event, điều kiện hoàn thành, reward và chống nhận lặp.

Ví dụ chuỗi onboarding:

1. Mua gói nguyên liệu đầu tiên.
2. Phục vụ 3 khách.
3. Kiếm 100.000 VNĐ doanh thu.
4. Xem báo cáo lãi/lỗ.
5. Điều chỉnh giá một sản phẩm.
6. Đạt đánh giá trung bình 4 sao.
7. Thuê nhân viên đầu tiên.

### 18.2 Thành tựu

- Tài chính: 10 triệu, 1 tỷ, 1.000 tỷ tài sản ròng.
- Vận hành: phục vụ nhanh, không để khách bỏ hàng, chuỗi 10 cửa hàng.
- Khám phá: thử mọi ngành, hoạt động ở nhiều khu vực.
- Con người: tạo việc làm, đào tạo quản lý, giữ nhân viên lâu năm.
- Thử thách: sống sót qua khủng hoảng, phục hồi sau phá sản.

### 18.3 Leaderboard

- Xếp theo tài sản ròng, doanh thu, lợi nhuận, số việc làm, bất động sản và quy mô chuỗi.
- Có scope khu phố → tỉnh → quốc gia → khu vực → thế giới.
- MVP là leaderboard cục bộ trộn NPC; multiplayer mới có người thật.
- Dùng snapshot theo kỳ, không tính trực tiếp trên mọi frame.
- Khi online cần phát hiện gian lận, ẩn dữ liệu nhạy cảm và cơ chế khiếu nại.

---

## 19. Offline progress

### 19.1 Nguyên tắc

- Offline progress là mô phỏng rút gọn, không chạy lại từng frame.
- Dùng state tại lúc thoát, lịch mở cửa, tồn kho, nhân sự, thời tiết/sự kiện đã seed và thời gian server đáng tin khi online.
- Kết quả phải có cùng quy luật kinh tế với online trong sai số chấp nhận được.

### 19.2 Thuật toán MVP

1. Ghi `lastActiveAt`, state hash và snapshot khi app ẩn/đóng.
2. Khi mở lại, tính thời gian vắng mặt và giới hạn theo cap.
3. Chia khoảng vắng thành block 30 phút game.
4. Với mỗi block: xác định cửa hàng mở, nhu cầu, công suất, tồn kho, doanh thu, chi phí và event.
5. Dừng bán sản phẩm nếu hết nguyên liệu; không cho tồn kho âm.
6. Gộp giao dịch nhỏ thành ledger summary nhưng giữ chi tiết ngoại lệ.
7. Tạo báo cáo và chỉ áp state sau khi validation thành công.

### 19.3 Báo cáo trở lại

- Thời gian vắng mặt.
- Doanh thu, giá vốn, chi phí và lợi nhuận.
- Số khách, khách bỏ đi, sản phẩm hết hàng.
- Nhân viên nghỉ/được cải thiện kỹ năng.
- Sự kiện quan trọng và thay đổi thị trường.
- Nút đi thẳng tới vấn đề cần xử lý.

### 19.4 Chống chỉnh giờ

- Offline-only: phát hiện clock rollback và giới hạn reward; không trừng phạt nhầm quá nặng.
- Online: dùng thời gian server và signed snapshot.
- Mọi trường hợp bất thường được log để phân tích.

---

## 20. UI/UX mobile-first

### 20.1 Khung màn hình chính

```text
┌──────────────────────────────────┐
│ Avatar  Lv   Tiền   07:15  ☀     │
├──────────────────────────────────┤
│                                  │
│        KHU PHỐ 2D / PHASER       │
│    NPC • cửa hàng • xe • mưa     │
│                                  │
│ [Nhiệm vụ]              [Tin tức]│
├──────────────────────────────────┤
│ Bản đồ | K.doanh | Đầu tư | Chat │
│              Nhân vật            │
└──────────────────────────────────┘
```

Các panel trượt/modal phủ lên viewport; không biến màn hình chính thành một trang dài cuộn liên tục.

### 20.2 Điều hướng chính

- **Bản đồ:** khu phố, điểm kinh doanh, di chuyển và mở rộng.
- **Kinh doanh:** danh sách cơ sở, tồn kho, nhân viên, giá, dashboard.
- **Đầu tư:** khóa ở MVP hoặc hiển thị preview có điều kiện rõ ràng.
- **Chat:** NPC/bản tin trong MVP; chat thật ở giai đoạn online.
- **Nhân vật:** trang bị, kỹ năng, nhà/xe, thành tựu, cài đặt.

### 20.3 Màn hình bắt buộc của MVP

1. Splash/loading và kiểm tra save.
2. Tạo nhân vật.
3. Intro/tutorial.
4. Bản đồ khu phố.
5. Chi tiết điểm kinh doanh.
6. Mua nguyên liệu/tồn kho.
7. Sản phẩm và định giá.
8. Tuyển dụng/lịch nhân viên.
9. Báo cáo cuối ngày.
10. Dashboard 7/30 ngày.
11. Tin tức/dự báo.
12. Nhiệm vụ/thành tựu.
13. Offline report.
14. Save/export/import/cài đặt.

### 20.4 Quy tắc UX

- Vùng chạm tối thiểu khoảng 44×44 CSS px.
- Tôn trọng safe area trên thiết bị tai thỏ/thanh điều hướng.
- Các con số tiền dùng định dạng Việt Nam: `1.250.000 ₫`; có dạng rút gọn `1,25 tr` khi thiếu chỗ và tooltip giá trị đầy đủ.
- Màu lãi/lỗ không chỉ dùng xanh/đỏ; luôn có dấu, icon hoặc nhãn.
- Hành động chi tiền lớn có màn hình xác nhận và nêu số dư sau giao dịch.
- Có undo chỉ cho thao tác cấu hình chưa phát sinh giao dịch; giao dịch tài chính dùng compensating transaction.
- Tutorial có thể bỏ qua, xem lại và không khóa người chơi lâu.
- Tất cả biểu đồ có bảng dữ liệu thay thế.

### 20.5 Responsive

- Mục tiêu chính: chiều rộng 360–430 px.
- Hỗ trợ từ 320 px với layout tối giản.
- Tablet dùng panel hai cột.
- Desktop giới hạn khu game hợp lý và dùng không gian bên cạnh cho dashboard, không phóng sprite quá mức.
- Landscape hiển thị bản đồ rộng hơn nhưng không bắt buộc xoay màn hình.

---

## 21. Định hướng hình ảnh và âm thanh

### 21.1 Art direction

- 2D cartoon/chibi nhẹ, hình khối rõ, màu sáng nhưng không quá bão hòa.
- Isometric hoặc top-down nghiêng nhất quán; chốt tile size ngay trong technical spike.
- Dấu ấn Việt Nam qua kiến trúc, vật dụng, cây xanh, biển hiệu và nhịp đường phố.
- Không dùng logo/thương hiệu có bản quyền nếu chưa được phép.
- Biển hiệu hư cấu nhưng dễ hiểu: tạp hóa, cơm, cà phê, nhà thuốc, cửa hàng tiện lợi.

### 21.2 Bộ animation MVP

Nhân vật chính: idle, walk 8 hướng, run 8 hướng, carry, prepare/cook, sell, phone, sit, ride.
NPC: idle, walk, queue, order, pay, consume, react happy/angry.
Nhân viên: theo trạm làm việc và vai trò.
Mỗi animation có fallback ít frame cho thiết bị yếu.

### 21.3 Asset pipeline

- Quy ước pixel density, pivot, shadow, sorting layer và atlas.
- Tên file: `category_entity_action_direction_variant`.
- Sprite atlas theo khu/nhân vật để tránh tải toàn bộ.
- Texture compression phù hợp web; giữ source chất lượng cao riêng.
- Kiểm tra license và metadata nguồn cho mọi asset.

### 21.4 Âm thanh

- Nhạc nền theo sáng/trưa/tối và khu vực.
- Ambience: xe máy, chợ, mưa, tiếng quán.
- SFX giao dịch, chế biến, cảnh báo, thành tựu.
- Điều khiển riêng music/SFX/ambience; tự giảm âm khi app ra nền.
- Không tự phát âm thanh trước tương tác đầu tiên do giới hạn trình duyệt.

---

## 22. Kiến trúc kỹ thuật tổng thể

### 22.1 Nguyên tắc

- Simulation core là TypeScript thuần, không import React, Phaser hoặc API trình duyệt.
- Phaser chỉ render thế giới và nhận lệnh; React quản lý UI/panel.
- Mọi thay đổi domain đi qua command/use-case; không sửa state tùy tiện từ component.
- Hệ thống giao tiếp qua typed events và state selectors.
- Dữ liệu nội dung nằm trong schema versioned, có validator.
- Tính toán tiền dùng integer; tỷ lệ dùng basis point hoặc fixed-point khi cần.

### 22.2 Công nghệ đề xuất

**MVP client**

- React + TypeScript + Vite.
- Phaser cho bản đồ, sprite, camera, particles và animation.
- Zustand hoặc Redux Toolkit cho application/UI state; simulation state không phụ thuộc store UI.
- Dexie bọc IndexedDB.
- Zod hoặc JSON Schema cho validation dữ liệu/save.
- Workbox/Vite PWA plugin cho service worker và manifest.
- Vitest cho unit/integration; Playwright cho end-to-end.

**Backend khi mở online**

- Node.js + NestJS.
- PostgreSQL cho dữ liệu bền vững và ledger.
- Redis cho cache, session, presence, rate limit và leaderboard.
- WebSocket/Socket.IO cho realtime có chọn lọc.
- Job queue cho offline simulation, leaderboard snapshot, event toàn server.
- Object storage + CDN cho asset và snapshot/export.

Phiên bản thư viện phải được khóa trong lockfile và nâng theo quy trình kiểm thử, không ghi cứng số phiên bản vào thiết kế dài hạn.

### 22.3 Module/engine

```text
TimeEngine
WeatherEngine
CalendarEngine
MapEngine
DemandEngine
NpcEngine
BusinessEngine
InventoryEngine
EmployeeEngine
EconomyEngine
FinanceEngine
MarketEngine
EventEngine
NewsEngine
QuestEngine
RankingEngine
ChatEngine
OfflineEngine
SaveEngine
TelemetryEngine
```

Mỗi engine công bố input/output rõ ràng và không tạo vòng phụ thuộc. `TimeEngine` phát tick; orchestrator gọi engine theo thứ tự xác định.

### 22.4 Cấu trúc repository đề xuất

```text
/
├── apps/
│   ├── web/                    # React + Phaser + PWA
│   ├── api/                    # NestJS, chỉ thêm khi cần cloud/online
│   └── admin/                  # Công cụ nội dung/vận hành, hậu MVP
├── packages/
│   ├── simulation-core/        # Domain và các engine thuần TS
│   ├── content-schema/         # Schema + validator + migration
│   ├── game-content/           # JSON/TS data ngành, sản phẩm, event
│   ├── shared-types/           # Contract client/server
│   ├── ui/                     # Component dùng chung
│   └── test-fixtures/          # Seed/save mẫu có kiểm soát
├── assets/
│   ├── source/                 # File nguồn, có thể để ngoài build/CDN
│   └── manifests/              # Asset manifest/version
├── docs/
│   ├── game-design/
│   ├── architecture/
│   ├── balancing/
│   └── runbooks/
├── tools/                      # Validate content, migrate save, benchmark
├── PLAN.md
└── README.md
```

### 22.5 Ranh giới React–Phaser

- React gửi command như `OPEN_BUSINESS`, `SET_PRICE`, `HIRE_EMPLOYEE` vào application layer.
- Simulation trả state/event đã xác nhận.
- Phaser đọc render projection, không đọc database và không tự cộng tiền.
- Click vào sprite phát selection event; React mở panel tương ứng.
- Camera/animation state không đưa vào domain save trừ khi cần khôi phục trải nghiệm.

---

## 23. Pipeline mô phỏng

### 23.1 Thứ tự tick chuẩn

```text
1. Nhận command người chơi đã xếp hàng
2. Tiến thời gian/lịch
3. Cập nhật thời tiết/sự kiện đến hạn
4. Cập nhật nhu cầu khu vực
5. Sinh/ghép lượt khách
6. Di chuyển và hàng chờ
7. Nhân viên/trạm phục vụ
8. Tồn kho/chế biến/giao dịch
9. Hài lòng, review, danh tiếng
10. Chi phí định kỳ/lương/nợ/thuế đến hạn
11. AI đối thủ theo nhịp riêng
12. Quest/achievement/ranking counters
13. Phát domain events và render snapshot
14. Autosave nếu tới mốc hoặc có giao dịch quan trọng
```

### 23.2 Nhịp cập nhật

- Animation/render: theo requestAnimationFrame, mục tiêu 60 FPS.
- Simulation foreground: tick theo 1 phút game.
- AI quyết định: 30 phút đến 1 ngày game tùy cấp.
- Khu ngoài màn hình: batch 5–60 phút game.
- Dashboard aggregate: cập nhật 5–15 phút game hoặc khi mở panel.
- Autosave: mỗi 20 giây thật, khi app ẩn và sau giao dịch quan trọng.

### 23.3 Event sourcing chọn lọc

Không cần lưu mọi tick. Lưu:

- Snapshot state định kỳ.
- Ledger tài chính đầy đủ.
- Domain event quan trọng: mua tài sản, thuê nhân viên, mở cơ sở, sự kiện, achievement.
- Aggregate số lượng giao dịch nhỏ theo ca/ngày.

---

## 24. Mô hình dữ liệu cốt lõi

### 24.1 Các entity chính

| Entity | Trường bắt buộc tiêu biểu |
|---|---|
| PlayerProfile | id, displayName, settings, createdAt |
| Character | id, ageDays, appearance, skills, level, energy, reputation |
| WorldState | id, seed, gameMinute, calendar, economyIndex, contentVersion |
| Region | id, parentId, type, demographics, costs, demandProfile |
| Lot | id, regionId, coordinates, type, trafficProfile, ownerId, tenantId |
| BusinessDefinition | id, category, unlock, stations, products, modifiers |
| Business | id, definitionId, ownerId, lotId, status, schedule, brand, cashPolicy |
| ProductDefinition | id, category, recipeId, baseDemand, shelfLife |
| Recipe | id, inputs, outputQty, preparationTime, stationType |
| InventoryLot | id, itemId, quantity, unitCost, acquiredAt, expiresAt |
| Employee | id, employerId, role, stats, wage, schedule, morale, traits |
| CustomerArchetype | id, schedule, income, preferences, patience, priceSensitivity |
| PersistentNpc | id, archetypeId, memory, loyalty, relationships |
| Rival | id, personality, goals, portfolio, budget, strategyWeights |
| EventInstance | id, definitionId, scope, start, end, modifiers, state |
| LedgerEntry | id, timestamp, debit, credit, amount, reason, referenceId |
| Review | id, businessId, rating, tags, createdAt, customerRef? |
| QuestState | questId, status, counters, acceptedAt, completedAt |
| SaveEnvelope | schemaVersion, contentVersion, checksum, savedAt, payload |

### 24.2 ID và đơn vị

- ID dùng UUID/ULID hoặc ID ổn định từ content; không dùng tên hiển thị làm khóa.
- Tiền: integer VNĐ an toàn; nếu quy mô vượt giới hạn số JS, chuyển BigInt/string serialization hoặc fixed 64-bit ở backend.
- Tỷ lệ: basis points (`10000 = 100%`).
- Thời gian: game minute integer; thời gian thật ISO 8601 UTC.
- Số lượng nguyên liệu có fixed precision theo đơn vị nhỏ nhất được định nghĩa.

### 24.3 Ví dụ cấu hình sản phẩm

```json
{
  "id": "product_xoi_man_basic",
  "nameKey": "product.xoi_man_basic.name",
  "recipeId": "recipe_xoi_man_basic_v1",
  "basePrice": 20000,
  "baseDemand": 6500,
  "preferredSegments": ["student", "worker"],
  "peakWindows": [{ "from": "05:30", "to": "09:00", "factorBps": 14500 }],
  "weatherModifiers": { "cold": 12000, "hot": 9000 },
  "shelfLifeGameMinutes": 300
}
```

Các giá trị chỉ minh họa cấu trúc, không phải cân bằng cuối cùng.

---

## 25. Lưu dữ liệu, migration và khôi phục

### 25.1 Save Envelope

Mỗi save gồm:

- `schemaVersion` để migrate cấu trúc.
- `contentVersion` để đối chiếu dữ liệu game.
- `buildVersion` để truy vết.
- `worldSeed`, `savedAt`, `lastActiveAt`.
- `payload` đã chuẩn hóa.
- `checksum` phát hiện hỏng dữ liệu vô ý; khi online dùng chữ ký server.

### 25.2 Slot lưu

- 1 autosave chính.
- 3 snapshot gần nhất để phục hồi.
- 1 manual export được người chơi tải về.
- Không ghi đè toàn bộ ngay nếu validation thất bại.

### 25.3 Migration

- Mỗi schema version có hàm migrate một chiều và test fixture.
- Migration chạy trên bản sao; validate rồi mới commit.
- Nếu thất bại, giữ save cũ và hiển thị hướng dẫn export/chẩn đoán.
- Content bị xóa cần mapping hoặc placeholder an toàn, không làm mất tài sản.

### 25.4 Cloud save hậu MVP

- Conflict resolution hiển thị hai bản theo thời gian, tài sản và tiến trình; không âm thầm chọn.
- Server snapshot có revision/ETag để optimistic concurrency.
- Thiết bị mới tải snapshot, xác minh rồi replay event quan trọng nếu cần.

---

## 26. Backend và multiplayer lai NPC

### 26.1 Mô hình server

- Server authoritative cho ví tiền, giao dịch, tài sản, thị trường và leaderboard.
- Client dự đoán animation/UI nhưng không tự xác nhận kết quả kinh tế.
- Thế giới chia shard theo server/khu vực; không cần mọi người ở một bản đồ vật lý duy nhất.
- NPC lấp đầy kinh tế và leaderboard theo quota từng tier.

### 26.2 Dịch vụ logic đề xuất

Khởi đầu bằng modular monolith NestJS, không tách microservice sớm:

- Auth/Profile.
- World/Simulation.
- Business/Economy.
- Market.
- Social/Chat.
- Ranking.
- Save/Sync.
- Admin/Moderation.

Chỉ tách service khi tải, ownership hoặc deployment thực tế yêu cầu.

### 26.3 Realtime

WebSocket chỉ dùng cho:

- Chat/presence.
- Sự kiện server sắp diễn ra.
- Cập nhật thị trường/đấu giá có nhịp.
- Thông báo cạnh tranh gần người chơi.

Các báo cáo, danh sách và cấu hình dùng HTTP API có cache. Không stream mọi NPC qua mạng.

### 26.4 Giao dịch an toàn

- Mỗi command tài chính có idempotency key.
- Transaction database khóa đúng aggregate/account.
- Ledger entry và thay đổi tài sản commit cùng transaction.
- Retry không được cộng tiền hai lần.
- Marketplace dùng escrow; timeout có quy trình hoàn trả.

---

## 27. API và event contract dự kiến

### 27.1 HTTP API mẫu

```text
POST   /auth/login
GET    /profiles/me
GET    /worlds/:worldId/snapshot
POST   /worlds/:worldId/commands
GET    /businesses/:id
POST   /businesses/:id/prices
POST   /businesses/:id/employees/hire
POST   /businesses/:id/inventory/orders
GET    /reports/daily?from=&to=
GET    /news
GET    /rankings/:board
POST   /saves/sync
```

### 27.2 Command envelope

```json
{
  "commandId": "ulid",
  "worldId": "ulid",
  "expectedRevision": 42,
  "type": "SET_PRODUCT_PRICE",
  "payload": { "businessId": "...", "productId": "...", "price": 25000 },
  "clientTime": "2026-01-01T00:00:00Z"
}
```

### 27.3 Domain events mẫu

- `BusinessOpened`
- `ProductSold`
- `InventoryDepleted`
- `CustomerAbandonedQueue`
- `EmployeeHired`
- `EmployeeQuit`
- `WeatherChanged`
- `EconomicEventStarted`
- `LoanPaymentMissed`
- `NetWorthMilestoneReached`

Event contract phải versioned; telemetry event và domain event là hai khái niệm riêng.

---

## 28. Bảo mật, riêng tư và an toàn cộng đồng

### 28.1 Client/MVP offline

- Không lưu secret trong client.
- Validate toàn bộ imported save; giới hạn kích thước và loại dữ liệu.
- Escape nội dung tên nhân vật/doanh nghiệp trước khi render.
- Service worker có chiến lược cập nhật an toàn, tránh giữ build cũ không tương thích save.
- Content Security Policy và dependency scanning ở bản triển khai web.

### 28.2 Online

- OAuth/OIDC đúng chuẩn; token ngắn hạn và refresh token bảo vệ phù hợp.
- Rate limit theo IP/account/device risk.
- Phân quyền admin theo vai trò, audit log không thể sửa trực tiếp.
- Chống replay/idempotency cho giao dịch.
- Phát hiện tốc độ tiến trình bất thường, số dư âm, giao dịch vòng và clock manipulation.
- Backup mã hóa, quy trình khôi phục và xóa tài khoản.

### 28.3 Chat và nội dung người dùng

- Lọc spam, từ cấm, link nguy hiểm và flood.
- Report, block, mute; moderator có queue và evidence snapshot.
- Không để bot giả làm người thật.
- Tên hiển thị, chat và nội dung cộng đồng phải có chính sách rõ ràng.

### 28.4 Pháp lý cần rà soát trước phát hành

- Chính sách quyền riêng tư, điều khoản sử dụng, độ tuổi và sự đồng ý telemetry.
- Quyền sở hữu/licensing asset, font, âm thanh, địa danh và thương hiệu.
- Cơ chế mua hàng trong ứng dụng, hoàn tiền và bảo vệ người tiêu dùng.
- Phân loại trò chơi và quy định phát hành tại các thị trường mục tiêu.
- Tính phù hợp của các hệ thống tài sản số/chứng khoán hư cấu.

Đây là checklist sản phẩm, không thay thế tư vấn pháp lý chuyên nghiệp.

---

## 29. Hiệu năng và khả năng mở rộng

### 29.1 Ngân sách client mục tiêu

- 60 FPS trên thiết bị tầm trung mục tiêu; cho phép chế độ 30 FPS ổn định trên thiết bị yếu.
- Không để simulation phụ thuộc FPS.
- Thời gian phản hồi thao tác UI phổ biến dưới 100 ms khi không có mạng.
- Tải vào phiên chơi sau cache trong vài giây trên mạng tốt; đo thực tế bằng thiết bị mục tiêu.
- Bộ nhớ có trần theo test device; atlas/scene cũ phải được giải phóng.
- Giới hạn NPC render đồng thời theo cấu hình chất lượng, ví dụ 40/70/100.

### 29.2 Kỹ thuật tối ưu

- Object pooling cho NPC, icon nổi, particle và xe.
- Culling ngoài camera, texture atlas, lazy loading theo khu.
- Web Worker cho offline calculation/batch simulation nếu profiling chứng minh cần.
- Aggregate NPC ngoài camera.
- Memoize selector/dashboard; không render lại toàn UI mỗi tick.
- Không serialize toàn state mỗi frame; autosave incremental hoặc snapshot theo nhịp.

### 29.3 Benchmark bắt buộc

- 100 khách đến trong giờ cao điểm.
- 10 cửa hàng hoạt động cùng khu.
- Chuyển x1 → x4 trong 5 phút thật.
- Offline 8 giờ với nhiều cơ sở.
- Save lớn và migrate qua nhiều version.
- Thiết bị RAM thấp, tab ẩn/hiện, mất mạng, hết dung lượng IndexedDB.

---

## 30. Khả năng truy cập và bản địa hóa

- Font tiếng Việt đầy đủ dấu, đọc tốt ở 12–16 px CSS trở lên tùy vai trò.
- Không truyền đạt trạng thái chỉ bằng màu.
- Có giảm chuyển động, giảm particle và tắt rung.
- Phụ đề/text cho thông tin âm thanh quan trọng.
- Hỗ trợ screen reader cho UI React; canvas có bảng/controls tương đương cho hành động quan trọng.
- Phóng to UI, tương phản cao và vùng chạm lớn.
- Chuỗi UI không hard-code; dùng key i18n từ đầu.
- Định dạng tiền, ngày, số theo locale; tên riêng/content tách khỏi logic.

---

## 31. Analytics, cân bằng và quan sát hệ thống

### 31.1 Sự kiện analytics cốt lõi

- `tutorial_started/completed/skipped`
- `business_started/opened/closed`
- `product_price_changed`
- `employee_hired/quit`
- `day_completed`
- `offline_report_viewed`
- `quest_completed`
- `bankruptcy_warning/occurred/recovered`
- `save_failed/recovered/exported`
- `session_started/ended`

Không gửi tên thật, nội dung chat hoặc dữ liệu nhạy cảm khi không cần. Analytics phải có schema, version và consent.

### 31.2 Funnel cần xem

1. Mở game.
2. Hoàn thành tạo nhân vật.
3. Chọn nghề.
4. Mua nguyên liệu.
5. Bán đơn đầu.
6. Kết thúc ngày đầu.
7. Thuê nhân viên đầu.
8. Quay lại ngày tiếp theo.

### 31.3 Chỉ số cân bằng

- Thời gian đạt từng cột mốc tài sản.
- Lợi nhuận/giờ theo nghề và khu vực.
- Tỷ lệ khách bỏ đi theo nguyên nhân.
- Tỷ lệ hàng hỏng/hết hàng.
- Chi phí nhân sự/doanh thu.
- Tỷ lệ phá sản và khả năng phục hồi.
- Mức tập trung thị trường, chiến lược thống trị.

### 31.4 Công cụ debug

- Time controls và jump-to-time.
- Seed selector/replay.
- Inspector nhu cầu/utility khách.
- Xem modifier stack của doanh thu/giá.
- Spawn weather/event có kiểm soát.
- Grant/revoke tài nguyên chỉ trong dev build.
- Export state và log gọn để báo bug.

---

## 32. Pipeline nội dung và cân bằng

### 32.1 Data-driven content

Ngành nghề, sản phẩm, công thức, event, quest, achievement, nhân viên, đối thủ và lời thoại phải là dữ liệu được validate. Code chỉ chứa quy tắc chung.

### 32.2 Quy trình thêm nội dung

1. Viết content brief và mục tiêu gameplay.
2. Thêm definition theo schema.
3. Chạy validator: ID, reference, range, localization, asset.
4. Chạy simulation batch 30/90/365 ngày với nhiều seed.
5. Review economy và exploit.
6. Playtest UX.
7. Phê duyệt art/audio/text.
8. Gắn content version và phát hành.

### 32.3 Simulation cân bằng hàng loạt

Tạo headless runner chạy hàng nghìn kịch bản:

- Người chơi thận trọng, trung bình, tối ưu và ngẫu nhiên.
- Các nghề/khu/thời tiết khác nhau.
- Theo dõi phá sản, tài sản ròng, biên lợi nhuận và điểm nghẽn.
- Báo khi economy sinh tiền vô hạn, tồn kho âm, giá phi lý hoặc một chiến lược thống trị.

### 32.4 Quy tắc sửa cân bằng

- Ưu tiên sửa nguyên nhân chứ không chỉ nerf phần thưởng.
- Thay đổi lớn phải có patch note dễ hiểu.
- Không làm tài sản người chơi mất giá mạnh mà không có cơ chế chuyển tiếp/bồi hoàn phù hợp.
- Duy trì save compatibility và migration content.

---

## 33. Kế hoạch kiểm thử

### 33.1 Unit test

- Công thức tiền, thuế, lãi, giá vốn, net worth.
- Demand/utility và cạnh tranh tổng bằng giới hạn khách.
- Hàng chờ, kiên nhẫn, tốc độ phục vụ.
- Tồn kho, hạn dùng và không âm.
- Seeded random và determinism.
- Skill/modifier stack và cap.
- Calendar, ngày lễ, chuyển ngày/năm.
- Save migration từng version.

### 33.2 Property-based/invariant test

- Tổng tiền chỉ đổi qua ledger hợp lệ.
- Không có quantity, tiền vay hoặc thời gian âm trái luật.
- Save → load → save giữ state tương đương.
- x1 chạy N tick bằng x4 chạy cùng N tick về kết quả domain.
- Offline aggregate nằm trong sai số cho phép so với foreground simulation.
- Thêm đối thủ không làm tổng nhu cầu khu vực tự tăng vô hạn.

### 33.3 Integration test

- React command → simulation → Phaser projection.
- Mở bán → khách → hàng chờ → giao dịch → báo cáo.
- Thuê nhân viên → lịch → lương → tinh thần/nghỉ việc.
- Weather/event → demand → news → report explanation.
- Autosave khi app ẩn và restore khi mở lại.

### 33.4 End-to-end

- Người mới hoàn thành tutorial trên viewport mobile.
- Chơi qua 7 ngày, thuê nhân viên và lưu lại.
- Offline report sau khi giả lập thời gian vắng.
- Import save hợp lệ và từ chối save hỏng.
- PWA install/update/offline shell.
- Keyboard/touch và các luồng accessibility chính.

### 33.5 Test thủ công

- Ma trận trình duyệt iOS Safari, Android Chrome, desktop Chrome/Edge/Firefox.
- Màn hình nhỏ, tai thỏ, orientation, zoom.
- Mạng chậm/mất mạng, hết dung lượng, pin saver.
- Các ngôn ngữ dài hơn trong tương lai.
- Kiểm tra dấu tiếng Việt và line break ở mọi panel.

### 33.6 Tiêu chuẩn bug trước release

- Không còn P0: mất save, nhân đôi tiền, không vào game, crash hàng loạt.
- P1 có workaround phải được chấp thuận rõ ràng; mặc định không phát hành nếu ảnh hưởng kinh tế/save.
- P2/P3 được triage với owner và mốc sửa.

---

## 34. CI/CD và môi trường

### 34.1 Pipeline pull request

1. Format/lint/typecheck.
2. Unit + invariant test.
3. Validate toàn bộ content và localization.
4. Build production.
5. E2E smoke trên mobile viewport.
6. Bundle/performance budget check.
7. Dependency/license/security scan.
8. Preview deploy cho QA.

### 34.2 Môi trường

- Local development.
- Preview theo pull request.
- Staging với dữ liệu test và telemetry riêng.
- Production.

Save/data giữa các môi trường tuyệt đối không dùng chung. Admin action production cần audit.

### 34.3 Phát hành

- Feature flag cho hệ thống lớn.
- Rollout theo phần trăm và theo cohort nếu có backend.
- Service worker update có thông báo và chỉ reload ở điểm an toàn.
- Có rollback build; migration dữ liệu phải backward-aware hoặc có kế hoạch forward fix.
- Backup/restore drill trước khi mở online economy.

---

## 35. Lộ trình phát triển theo phase

### Phase 0 – Tiền sản xuất và technical spike (2–4 tuần)

**Mục tiêu:** loại bỏ rủi ro lớn trước khi sản xuất nội dung.

**Đầu ra:**

- Chốt góc nhìn, tile size, camera, sorting và art sample.
- Prototype React–Phaser bridge.
- Simulation clock deterministic và 100 NPC di chuyển thử.
- Schema nội dung, ledger và save envelope đầu tiên.
- Một quầy xôi chạy bằng dữ liệu thô.
- Benchmark trên tối thiểu 3 thiết bị mục tiêu.
- Wireframe toàn bộ luồng 30 phút đầu.

**Exit criteria:** chạy ổn định, save/load đúng, đội ngũ chốt được scope Vertical Slice.

### Phase 1 – Vertical Slice (6–10 tuần)

**Mục tiêu:** chứng minh fun và cảm giác thế giới sống.

**Đầu ra:** toàn bộ mục 6.1, art gần chất lượng thật cho một khu, audio cơ bản, tutorial 7 ngày.

**Exit criteria:**

- 10–20 người thử nghiệm độc lập chơi không cần người hướng dẫn.
- 70% hoàn thành ngày đầu.
- Người chơi nhận ra tác động của giờ, vị trí và thời tiết.
- Không có lỗi save/tiền nghiêm trọng.

### Phase 2 – MVP offline/PWA (12–20 tuần)

**Mục tiêu:** bản có thể phát hành alpha/beta công khai giới hạn.

**Đầu ra:** toàn bộ mục 6.2, analytics, balancing tool, accessibility cơ bản, PWA, QA matrix.

**Exit criteria:**

- Chơi ổn định ít nhất 30 ngày game.
- 5 nghề có chiến lược khác nhau và không có nghề thống trị rõ rệt.
- Offline 8 giờ không sai ledger/tồn kho.
- Crash-free và performance đạt ngân sách trên test devices.

### Phase 3 – Thành phố và cuộc sống (4–6 tháng)

- 20–30 ngành nghề.
- Nhiều khu vực, nhà ở, xe cộ và logistics nội đô.
- Marketing sâu, nhân viên nâng cao, boss và hàng trăm sự kiện.
- Ngân hàng, tín dụng, thuế/chi phí mở rộng.
- Chuỗi cửa hàng và quản lý vùng.

### Phase 4 – Đầu tư (4–6 tháng)

- Vàng, chứng khoán hư cấu, bất động sản, tài sản số hư cấu.
- Tin kinh tế, chu kỳ thị trường, cho vay và đầu tư doanh nghiệp.
- Công cụ giải thích rủi ro, chống exploit và simulation batch nâng cao.

### Phase 5 – Đế chế (6–9 tháng)

- Công ty, nhà máy, chuỗi cung ứng, logistics liên tỉnh.
- Tập đoàn, M&A, cổ phần, niêm yết và quản trị cấp cao.
- Bản đồ nhiều tỉnh/thành, mô phỏng nhiều cấp độ chi tiết.

### Phase 6 – Online World (6–12 tháng, sau khi economy offline ổn định)

- Tài khoản, cloud save, server authoritative.
- Multiplayer lai NPC, chat người thật, marketplace an toàn.
- Hiệp hội doanh nhân, leaderboard server, sự kiện toàn server.
- Moderation, anti-cheat, observability, live operations.

Các ước lượng chỉ là khung. Sau mỗi phase phải estimate lại từ velocity và dữ liệu thực tế.

---

## 36. Kế hoạch sprint chi tiết cho MVP

Giả định sprint 2 tuần và một đội đa chức năng 5–8 người.

| Sprint | Trọng tâm | Kết quả phải demo được |
|---|---|---|
| 0 | Setup/kiến trúc | CI, monorepo, Phaser scene, React overlay, content schema |
| 1 | Time/map/character | Nhân vật đi trong khu phố, đồng hồ deterministic |
| 2 | Quầy xôi đầu tiên | Mua nguyên liệu, mở bán, khách đến và giao dịch |
| 3 | Demand/queue | Khung giờ, phân khúc, hàng chờ, khách bỏ đi |
| 4 | Weather/report | Mưa/nắng tác động, báo cáo cuối ngày có giải thích |
| 5 | Save/tutorial | Save/load/migration v1, onboarding ngày đầu |
| 6 | Hai nghề bổ sung | Bánh mì, nước mía, recipe/station data-driven |
| 7 | Employee | Tuyển, lịch, hiệu suất, lương và tinh thần |
| 8 | Khu/marketing | 3 vùng nhu cầu, giá, review, marketing cơ bản |
| 9 | Hai nghề còn lại | Vé số, trà sữa, cân bằng 5 nghề |
| 10 | Event/NPC social | Tin tức, 40 event, boss/chat/leaderboard giả lập |
| 11 | Offline/PWA | Offline aggregate, return report, install/update |
| 12 | Dashboard/quests | Sổ cái, biểu đồ, nhiệm vụ, thành tựu |
| 13 | Performance/a11y | Device optimization, accessibility, error recovery |
| 14 | Alpha QA | E2E, migration, exploit pass, closed alpha |
| 15+ | Beta hardening | Cân bằng, retention fixes, polish, release candidate |

---

## 37. Nhân sự và trách nhiệm

### 37.1 Đội tối thiểu khuyến nghị

- 1 Product Owner/Game Director: tầm nhìn, scope, quyết định ưu tiên.
- 1 Game Designer/Economy Designer: công thức, cân bằng, content và playtest.
- 1–2 Frontend/Game Engineers: Phaser, React, performance, PWA.
- 1 Simulation/Backend Engineer: domain, save, ledger, công cụ mô phỏng; giai đoạn online chuyển trọng tâm backend.
- 1 2D Artist/Animator: environment, character, UI asset, atlas.
- 1 UI/UX Designer: flow mobile, design system, usability.
- QA bán thời gian từ sớm, toàn thời gian trước alpha/beta.
- Audio, narrative/localization, legal và community có thể thuê theo giai đoạn.

### 37.2 Nếu làm solo

Phải giảm scope Vertical Slice còn 1 khu, 1 nghề, 2 phân khúc khách, 2 thời tiết và chưa có boss/chat/leaderboard. Ưu tiên asset pack hợp pháp, animation tối giản và công cụ debug. Một MVP đầy đủ như mục 6.2 có thể cần nhiều tháng đến hơn một năm tùy thời gian và kinh nghiệm; không nên hứa lịch cứng trước spike.

### 37.3 Ownership

- Mỗi engine có một owner kỹ thuật.
- Mỗi bảng cân bằng có owner thiết kế.
- Mọi metric/release criterion có người chịu trách nhiệm xác nhận.
- Một quyết định kiến trúc lớn phải có ADR ngắn: bối cảnh, lựa chọn, quyết định, hậu quả.

---

## 38. Backlog theo Epic và tiêu chí nghiệm thu

### EPIC E01 – Nền tảng ứng dụng

- Khởi tạo web app, lint/typecheck/test/build.
- React overlay hoạt động trên Phaser canvas.
- Route/loading/error boundary/PWA shell.

**Nghiệm thu:** mở app trên mobile, tải scene, mở panel React, reload không lỗi.

### EPIC E02 – Simulation Clock

- Tick deterministic, pause/x1/x2/x4.
- Calendar, ngày/đêm, lifecycle tab nền.
- Seeded RNG.

**Nghiệm thu:** cùng seed và command tạo cùng state hash sau 10.000 tick.

### EPIC E03 – Map và Character

- Tilemap, collision, camera, pathfinding cơ bản.
- Tạo nhân vật và animation.
- Điểm tương tác/cửa hàng.

**Nghiệm thu:** điều khiển cảm ứng ổn định, không đi xuyên vật, sorting đúng.

### EPIC E04 – Business Core

- Business definition/instance.
- Lịch mở cửa, trạm, sản phẩm, định giá.
- Doanh thu/chi phí/ledger.

**Nghiệm thu:** một ngày bán hoàn chỉnh đối soát đúng từng đồng.

### EPIC E05 – Demand/NPC

- Archetype, traffic, utility, hàng chờ, review.
- LOD trong/ngoài camera.

**Nghiệm thu:** thay giá/vị trí/thời tiết tạo kết quả đúng chiều và giải thích được.

### EPIC E06 – Inventory/Supply

- Mua hàng, recipe, hạn dùng, hết hàng, hủy hàng.
- Supplier và auto reorder cơ bản.

**Nghiệm thu:** không thể bán khi thiếu nguyên liệu; giá vốn và tồn cuối khớp ledger.

### EPIC E07 – Employees

- Tuyển, lịch, vai trò, hiệu suất, lương, tinh thần.

**Nghiệm thu:** nhân viên giỏi tăng throughput nhưng vẫn chịu giới hạn thiết bị/tồn kho.

### EPIC E08 – Weather/Event/News

- Weather forecast, modifier, VFX.
- Event schema, lifecycle, news.

**Nghiệm thu:** event có bắt đầu/kết thúc đúng, không để modifier “ma” còn sót.

### EPIC E09 – Progression

- XP/level/kỹ năng, unlock, quest, achievement.

**Nghiệm thu:** có ít nhất hai con đường hợp lệ để đạt mốc thuê nhân viên.

### EPIC E10 – Save/Offline

- IndexedDB, snapshot, migration, export/import.
- Offline progress/report và clock anomaly.

**Nghiệm thu:** force-close ở thời điểm bất kỳ không mất giao dịch quan trọng; offline không nhân đôi tiền.

### EPIC E11 – Dashboard/UI

- HUD, navigation, business panels, report, chart.

**Nghiệm thu:** người mới tìm được doanh thu, chi phí, lợi nhuận và nguyên nhân trong dưới 30 giây.

### EPIC E12 – NPC Social

- Boss rule-based, chat template, leaderboard local.

**Nghiệm thu:** boss tạo cạnh tranh bằng cùng quy tắc và chat phản ánh state thật.

### EPIC E13 – Quality/Operations

- Analytics consent, crash report, debug inspector.
- Performance, accessibility, CI/CD, runbook.

**Nghiệm thu:** đạt release gate tại mục 42.

---

## 39. Monetization đề xuất

Monetization chỉ triển khai sau khi core loop đã vui và economy ổn định.

### 39.1 Có thể dùng

- Trang phục, kiểu tóc, skin quầy/cửa hàng, hiệu ứng và decoration.
- Gói nhạc/biển hiệu/chủ đề thẩm mỹ.
- Expansion nội dung lớn theo vùng/ngành nếu sản phẩm phù hợp.
- Optional rewarded ad với phần thưởng nhỏ, có cap và không buộc xem để tiến triển.
- Gói supporter không tăng sức mạnh kinh tế cạnh tranh.

### 39.2 Không dùng

- Bán tiền game không giới hạn.
- Bán xác suất thắng thị trường hoặc thông tin bí mật bắt buộc.
- Loot box trả phí có giá trị kinh tế.
- Paywall ngăn người không trả tiền cạnh tranh công bằng ở leaderboard.
- Dark pattern, đếm ngược giả hoặc ép quảng cáo sau mọi ngày game.

### 39.3 Tách economy

Nếu có tiền premium, tách ledger và mục đích khỏi VNĐ trong game. Premium không được đổi sang/ra tiền thật và không trở thành công cụ đầu cơ.

---

## 40. Rủi ro chính và phương án giảm thiểu

| Rủi ro | Mức | Hậu quả | Giảm thiểu |
|---|---:|---|---|
| Scope quá lớn | Rất cao | Không bao giờ ra bản chơi được | Vertical Slice nhỏ, exit criteria, khóa scope từng phase |
| Economy mất cân bằng | Rất cao | Một chiến lược thống trị, lạm phát | Ledger, headless simulation, telemetry, data-driven balance |
| Mô phỏng quá nặng | Cao | Giật/hao pin trên mobile | LOD, aggregate, pooling, benchmark từ Phase 0 |
| Save hỏng/mất | Rất cao | Mất niềm tin người chơi | Snapshot vòng, migration test, export, validation |
| Offline exploit | Cao | Leaderboard vô nghĩa | Server time online, cap, signed snapshot, anomaly detection |
| React/Phaser state xung đột | Cao | Bug khó tái hiện | Simulation core làm nguồn sự thật, typed command/event |
| Nội dung lặp lại | Cao | Retention thấp | Event graph, boss memory, content pipeline, seasonal content |
| Người mới bị ngợp | Cao | Rời game sớm | Progressive disclosure, tutorial theo ngữ cảnh, dashboard giải thích |
| AI boss gian lận | Trung–cao | Cảm giác bất công | Cùng quy tắc ngân sách, explainability, test behavior |
| Chat độc hại | Cao khi online | Rủi ro cộng đồng/pháp lý | Filter, report/block, moderation, rate limit |
| Vi phạm thương hiệu/tài sản | Cao | Gỡ nội dung/tranh chấp | Dùng thương hiệu hư cấu, asset registry, legal review |
| PWA update phá save | Cao | Người chơi mất tiến trình | Versioning, migration, safe update prompt, rollback |
| Tăng trưởng số quá lớn | Trung | Overflow/UI khó đọc | BigInt/64-bit plan, suffix formatting, economy sinks |

---

## 41. Các giả định và câu hỏi cần chốt

Các giả định hiện tại được dùng để lập kế hoạch:

- Game ưu tiên single-player offline trước, multiplayer sau.
- Không sử dụng tiền thật hoặc blockchain.
- Người chơi điều khiển một nhân vật chính, không điều khiển trực tiếp nhiều nhân vật gia đình ở MVP.
- Bản đồ MVP là hư cấu lấy cảm hứng Việt Nam, không tái tạo chính xác một thành phố thật.
- Kiểu điều khiển di chuyển sẽ được quyết định qua spike: chạm để đi hoặc joystick ảo; ưu tiên chạm để đi nếu pathfinding tốt.
- Game hướng tới chơi miễn phí có tùy chọn kiếm tiền đạo đức, nhưng mô hình kinh doanh cuối cùng chưa chốt.

Các quyết định Product Owner phải chốt trước khi kết thúc Phase 0:

1. Portrait-only hay hỗ trợ landscape đầy đủ ngay từ MVP.
2. Người chơi trực tiếp điều khiển nhân vật liên tục hay có fast travel sớm.
3. Mức “manual work” ban đầu: minigame nhẹ hay chỉ bố trí/ra lệnh.
4. Tông hài hước hay hiện thực trong lời thoại và sự kiện.
5. Mức độ dùng địa danh thật.
6. Có năng lượng/stamina hay chỉ dùng thời gian và công suất.
7. Monetization mục tiêu và thị trường phát hành đầu tiên.
8. Rating độ tuổi mục tiêu.

---

## 42. Release gates và tiêu chí nghiệm thu MVP

MVP chỉ được coi là hoàn thành khi đồng thời đạt các điều kiện sau.

### 42.1 Gameplay

- Chơi từ 18 tuổi/1.000.000 VNĐ tới sở hữu ít nhất một cửa hàng có nhân viên.
- 5 nghề hoạt động khác nhau về nhịp cầu, chi phí và chiến lược.
- Thời gian, thời tiết, vị trí, giá, chất lượng, marketing và cạnh tranh đều tác động thật.
- Người chơi xem được vì sao khách tăng/giảm và vì sao lời/lỗ.
- Không có vòng bấm vô hạn để sinh tiền ngoài mô phỏng.

### 42.2 Dữ liệu

- Save/load, autosave, export/import và migration có test.
- Không có đường tạo tiền/tài sản mà thiếu ledger entry.
- Offline report đối soát được và không làm tồn kho âm.
- Có recovery khi snapshot mới nhất hỏng.

### 42.3 Chất lượng

- Không còn bug P0/P1 ảnh hưởng save, tiền, tutorial hoặc khả năng vào game.
- Hoạt động trên ma trận thiết bị/trình duyệt mục tiêu.
- UI dùng được ở 320 px và không che bởi safe area.
- Performance đạt mục tiêu đã chốt qua benchmark thực tế.
- Có accessibility cơ bản và reduced motion.

### 42.4 Vận hành

- Có telemetry consent, crash/error logging và dashboard tối thiểu.
- Có quy trình backup source/assets, version content và rollback web build.
- Có changelog, privacy policy, terms và asset/license registry trước phát hành công khai.
- Có runbook xử lý mất save, build lỗi và service worker lỗi.

---

## 43. Definition of Ready và Definition of Done

### 43.1 Một task chỉ Ready khi

- Có mô tả giá trị người chơi.
- Có acceptance criteria kiểm thử được.
- Đã xác định dữ liệu/asset/dependency.
- Có thiết kế trạng thái loading, empty, error và offline nếu liên quan.
- Có yêu cầu analytics/accessibility/localization nếu cần.
- Không còn câu hỏi làm thay đổi bản chất giải pháp.

### 43.2 Một task chỉ Done khi

- Code/typecheck/lint/test pass.
- Được review và không phá ranh giới kiến trúc.
- Có test ở cấp phù hợp.
- Content/schema/localization được validate.
- Chạy trên mobile viewport và thiết bị mục tiêu liên quan.
- Có xử lý lỗi, telemetry vừa đủ và không lộ dữ liệu nhạy cảm.
- Tài liệu/ADR/changelog được cập nhật nếu hành vi thay đổi.
- Product/QA xác nhận acceptance criteria.

---

## 44. Kế hoạch 30 ngày đầu tiên

### Tuần 1 – Chốt sản phẩm và nền móng

- Chốt 8 câu hỏi Phase 0 tại mục 41.
- Viết one-page vision và storyboard 30 phút đầu.
- Lập wireframe mobile cho HUD, bản đồ, quầy xôi, tồn kho và báo cáo.
- Khởi tạo monorepo, CI, coding conventions và ADR template.
- Định nghĩa money/time/ID/content schema.

### Tuần 2 – Technical spike

- Phaser map thử, camera, sorting và 100 NPC giả.
- React panel phủ canvas và command bus.
- TimeEngine deterministic, seeded RNG và state hash.
- IndexedDB save envelope/migration v1.
- Benchmark trên thiết bị thấp/trung/cao đã chọn.

### Tuần 3 – Một ca bán xôi hoàn chỉnh

- Mua nguyên liệu, recipe, tồn kho.
- Khách đến theo khung giờ và vị trí.
- Hàng chờ, phục vụ, thanh toán, ledger.
- Đóng ca và báo cáo doanh thu/giá vốn/lợi nhuận.
- Inspector giải thích từng modifier.

### Tuần 4 – Chứng minh chiều sâu

- Thêm nắng/mưa và hai phân khúc khách.
- Thêm giá bán/chất lượng/kiên nhẫn.
- Chạy 1.000 simulation seed bằng headless runner.
- Playtest nội bộ và 5 người ngoài đội.
- Chốt backlog/estimate Vertical Slice dựa trên dữ liệu, không dựa trên cảm tính.

**Demo cuối ngày 30:** người chơi tạo nhân vật, mua nguyên liệu, mở quầy xôi gần trường, thấy học sinh đến giờ sáng, mưa làm giảm khách, bán hết/hỏng hàng, đóng ca, xem lời/lỗ, reload và chơi tiếp đúng state.

---

## 45. Thứ tự triển khai bắt buộc

1. Chứng minh simulation deterministic và ledger đúng.
2. Chứng minh một nghề vui trong một khu phố.
3. Chứng minh save/load/offline không phá economy.
4. Chứng minh content có thể thêm bằng dữ liệu.
5. Mở rộng thành 5 nghề và nhân viên.
6. Thêm chiều sâu qua thời tiết, sự kiện, boss và báo cáo.
7. Tối ưu mobile, accessibility và PWA.
8. Phát hành MVP offline, thu thập dữ liệu và cân bằng.
9. Chỉ sau đó xây đầu tư, đế chế và online world.

Nếu đảo thứ tự và làm multiplayer/thị trường lớn trước khi một quầy hàng đơn lẻ đã thú vị, dự án sẽ có chi phí cao nhưng chưa chứng minh được trải nghiệm cốt lõi.

---

## 46. Kết luận

“Khởi Nghiệp Việt” nên được xây như một **nền mô phỏng kinh tế có nhiều lớp**, bắt đầu từ một lát cắt rất nhỏ nhưng hoàn chỉnh. Phiên bản đầu không cần hàng trăm ngành hay toàn bộ Việt Nam; nó cần làm thật tốt cảm giác đứng trong một khu phố, quan sát khách thật sự có nhu cầu, thấy nhân viên thật sự làm việc và hiểu chính xác vì sao quyết định kinh doanh tạo ra lời hoặc lỗ.

Khi Time, Demand, Business, Economy, NPC và Save Engine đã đúng, các hệ thống lớn hơn—chuỗi cửa hàng, bất động sản, chứng khoán, tập đoàn và multiplayer—có thể mở rộng trên cùng một nền tảng. Mốc thành công đầu tiên không phải “có thật nhiều tính năng”, mà là: **người chơi bán xong một ngày, xem báo cáo, hiểu chuyện gì đã xảy ra và muốn lập tức thử một chiến lược tốt hơn vào ngày mai.**
