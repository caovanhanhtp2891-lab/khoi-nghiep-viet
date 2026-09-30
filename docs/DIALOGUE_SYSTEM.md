# Hội thoại và giao lưu khu phố

Cập nhật 30/09/2026. Hội thoại chạy trên máy; không gửi nội dung tới mô hình AI hoặc người chơi khác.

## Bộ 1.000 lời thoại

`dialogue.ts` có **50 tình huống được biên soạn**, mỗi tình huống gồm một câu hỏi và câu đáp phù hợp. Mỗi câu hỏi có 10 cách mở đầu, mỗi câu đáp có 10 cách kết thúc: **1.000 chuỗi lời thoại duy nhất**, không phải 1.000 tình huống riêng hay 1.000 câu được viết thủ công độc lập. Test đếm cả ID và văn bản, kiểm tra 10 câu mở/10 câu đáp mỗi tình huống.

Chủ đề: kinh doanh, khu phố, mưa, nóng, buổi tối, trường học, sức khỏe. Selector dùng ngày/giờ, variant NPC và chatSeq; cùng đầu vào cho cùng kết quả, không rút RNG kinh tế. Sequence giúp đổi lời đáp kể cả khi pause. Đây là chọn mẫu theo ngữ cảnh và từ khóa, chưa hiểu ngôn ngữ tự do hoặc lưu trí nhớ dài hạn.

- `npcLine`: chào hỏi theo bối cảnh; chuyện nghề có lời khuyên riêng của từng nghề; hai nút thêm chuyện khu phố/kinh doanh.
- `chatReply`: nhận chủ đề từ tin nhắn và trả lời NPC được chọn hoặc cư dân trong roster. Hỏi giá có giá thật của quầy. Từ khóa lợi nhuận/giá vốn, tồn kho, lương/công suất, thi đua, vốn, marketing và đơn đặt chọn nhóm tình huống sát câu hỏi thay vì toàn bộ chủ đề kinh doanh. Từ “mua hàng” không bị hiểu thành “mưa”; “tôi” không bị hiểu thành “buổi tối”.
- `npcConversation`: một cặp hỏi/đáp giữa hai NPC khác nhau mỗi 30 phút game. Tin trả lời gọi tên người hỏi, cùng một tình huống. Lịch sử vẫn tối đa 40 tin.
- `MainScene`: người đi bộ gần nhau có bubble hỏi/đáp; tối đa 10 NPC và 3 bubble. Lời cảnh và chat chọn từ cùng bộ nội dung nhưng không đồng bộ thành một sự kiện chung.

## Quan hệ chỉ tăng sau giao lưu

Nhìn thấy NPC, mở hồ sơ hoặc đọc NPC nói với nhau **không** tạo quan hệ. `talkToNpc` và `sendChat` trực tiếp dùng chung `interactionPatch`: lần giao lưu đầu/người/ngày +3 bond/+3 XP, bấm lặp/chat rồi chào cùng ngày không cộng lại. Giao đơn thành công +8 bond/+15 XP; đơn trả một lần như trước. Chat không cộng tiền.

Sổ cư dân có “Tất cả” và “Quen biết”; danh sách quen lọc `bond>0 || meetings>0`. Bond 0–100 hiển thị cấp 0–4: chưa gặp, đã làm quen, quen thuộc từ 25, thân thiết từ 60, tối đa 100. `meetings` ghi số ngày trò chuyện, không tăng khi chỉ xem.

Chat có chọn người nhận, gợi ý gửi nhanh, lịch sử cuộn riêng và ô nhập cố định trong bảng. Gửi tin đánh dấu NPC trả lời là người đã giao lưu. Nội dung nhập tối đa 160 ký tự; không dùng HTML để dựng lời thoại. Tin tự động không tạo bạn quen.

## Save và cư dân mới

Giữ payload **v6**: dữ liệu persist không thêm field bắt buộc. chatSeq/relationships/chat tiếp tục lưu như trước. 20 người mới nối tiếp ID `npc-101`…`npc-120`, không đổi 100 ID cũ. Để save cũ có đơn đang nhận vẫn hợp lệ ở ngày lớn, `dailyOrders` giữ pool gốc `variant<100`; chưa đưa 20 người mới vào đề nghị đặt hàng. Không thay modulo pool rồi làm đơn cũ bị invalid.

`situations.ts` bổ sung 10 nhu cầu khách (26 tổng), giữ ba lựa chọn/luồng RNG. Đơn vị lựa chọn phục vụ lấy từ nghề: phần/ổ/ly. Các khách của tình huống này chưa liên kết npcId, nên không tự tạo quan hệ của cư dân có cùng tên.

## Bố cục và hình ảnh

App.css: sheet giới hạn theo dvh, header/đóng bảng đứng riêng, một body cuộn; tabs giữ nền đặc và chuyển tab đưa body về đầu. Vận hành gập nhu cầu/nâng cấp mặc định. Chat giữ composer ngoài lịch sử; trường nhập font 16px. Chưa xác nhận bàn phím/safe area trên thiết bị thật.

`traffic.ts` vẽ xe máy, xe đạp, taxi, xe buýt, xe giao hàng, xe chở rau bằng Phaser Graphics. Đi hai chiều, tối đa 3 xe, chỉ trang trí; không ảnh hưởng doanh thu hoặc seed. `npcArt.ts` thêm mũ kê-pi, áo công an/dân quân/cứu hỏa, bộ đàm, máy tính kế toán. Tất cả vector là mã trong kho, không thêm raster tải ngoài.

## Xác nhận

64 test/8 file, 120 SVG khớp generator, lint/TypeScript/build pass. Test bao phủ 1.000 chuỗi, phân loại từ khóa, lựa chọn theo mưa, RNG độc lập, cặp NPC, quan sát không tăng quan hệ, chat/chào giới hạn chung sau reload, lịch sử có giới hạn, đơn cũ ổn định, các ID/ngoại hình mới. Chơi thử và commit cuối xem [STATUS.md](STATUS.md).
