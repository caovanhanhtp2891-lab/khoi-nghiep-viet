# Asset Street Edition

Ngày 30/09/2026. Built-in image generation tạo mới theo phong cách tham chiếu người dùng; chuyển định dạng WebP quality 88 để tối ưu tải, giữ alpha nhân vật. Không thay đổi bố cục raster khi chuyển định dạng.

| Đường dẫn trong kho | Thông số | Nơi dùng |
|---|---|---|
| public/assets/art/vietnam-street.webp | 1024×1536 RGB, khoảng 316KB | MainScene background |
| public/assets/art/characters.webp | 1254×1254 RGBA, khoảng 292KB, grid 4 cột×2 hàng | Phaser animation và CharacterArt React |
| public/assets/npcs/user-npc-01.png…12.png | Asset lịch sử, không dùng trong scene mới | Giữ trong kho để tham khảo |
| public/icon.svg, public/manifest.webmanifest | Metadata ứng dụng | HTML/PWA metadata |

Atlas: nam hàng 0, nữ hàng 1; 4 frame/hàng; x cột round(col×1254/4), cao mỗi frame 627. Phaser origin (0.5,0.94), hiển thị 110×220 world units; animation 7fps. React dùng background-size 400% 200%; URL theo import.meta.env.BASE_URL.

Đây là 2 nhân vật nền với 4 frame đi bộ mỗi loại, chưa phải 1.000 nhân vật hoặc 16 hướng nhìn. Cảnh nhà/quầy mẫu có biển không chữ để code gắn nhãn tiếng Việt. Xe xôi và xe máy thêm từ graphics trong scene.

Prompt dùng để tạo xem [ART_PROMPTS.md](ART_PROMPTS.md). Nguồn: built-in image generation của phiên Street Edition. Ảnh tham chiếu do người dùng cung cấp chỉ dùng định hướng phong cách/composition. Chưa thực hiện rà soát pháp lý riêng cho phát hành thương mại; không gán giấy phép OSS suy đoán cho raster.

Khi thêm asset: ghi nguồn, kích thước, frame layout, origin, key preload, URL base và nơi dùng; kiểm tra trên Pages. Không chỉ tăng số lượng trong preload mà quên animation/selection. Giữ ảnh gốc nếu cần làm lại, không đưa base64 tạm vào kho.
