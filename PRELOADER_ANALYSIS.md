# Phân tích nguyên nhân Preloader chậm

## 🔍 Vấn đề phát hiện

### 1. **Quá nhiều ảnh được thu thập**
- **Tổng số ảnh trong trang**: 118 ảnh
- **Vấn đề**: Code cũ thu thập tất cả ảnh above-the-fold (1.5x viewport)
- **Giải pháp**: Giảm xuống chỉ 1x viewport và giới hạn tối đa 10 ảnh

### 2. **Timeout quá lâu cho mỗi ảnh**
- **Trước**: 500ms timeout mỗi ảnh
- **Sau**: 300ms timeout mỗi ảnh
- **Vấn đề**: Nếu có 10 ảnh, mỗi ảnh timeout 500ms = tối đa 5 giây chờ

### 3. **Chờ quá nhiều ảnh**
- **Trước**: Chờ tối đa 10 ảnh critical
- **Sau**: Chỉ chờ tối đa 5 ảnh quan trọng nhất
- **Giải pháp**: Chỉ preload 5 ảnh đầu tiên trong danh sách

### 4. **Force timeout quá lâu**
- **Trước**: 800ms force timeout
- **Sau**: 600ms force timeout
- **Kết quả**: Preloader sẽ ẩn sau tối đa 600ms

### 5. **Thu thập background images không cần thiết**
- **Trước**: Thu thập từ header, section:first, elementor-section:first
- **Sau**: Chỉ thu thập từ header (quan trọng nhất)
- **Lý do**: Header là phần đầu tiên người dùng thấy

## 📊 Tối ưu hóa đã thực hiện

### Giảm số lượng ảnh:
1. ✅ Giới hạn tối đa 10 ảnh khi thu thập
2. ✅ Chỉ preload 5 ảnh đầu tiên
3. ✅ Giảm viewport từ 1.5x xuống 1x (chỉ ảnh thực sự visible)

### Giảm thời gian chờ:
1. ✅ Timeout mỗi ảnh: 500ms → 300ms
2. ✅ Force timeout: 800ms → 600ms
3. ✅ Chỉ chờ 5 ảnh thay vì 10

### Tối ưu logic:
1. ✅ Ưu tiên ảnh từ `<link rel="preload">` trong HTML
2. ✅ Chỉ thu thập background từ header
3. ✅ Bỏ qua section:first (không cần thiết)

## 🐛 Debug Logging

Đã thêm console.log để debug:
- `Preloader: Found X critical images` - Số ảnh critical tìm thấy
- `Preloader: Waiting for X critical images out of Y total` - Số ảnh đang chờ
- `Preloader: Force proceeding after timeout. Loaded: X Failed: Y` - Thông tin khi force proceed

## 📈 Kết quả mong đợi

### Trước tối ưu:
- Thu thập: ~20-30 ảnh critical
- Preload: 10 ảnh
- Timeout: 500ms × 10 = 5 giây tối đa
- Force timeout: 800ms
- **Tổng thời gian**: 0.8 - 5 giây

### Sau tối ưu:
- Thu thập: Tối đa 10 ảnh
- Preload: Chỉ 5 ảnh đầu tiên
- Timeout: 300ms × 5 = 1.5 giây tối đa
- Force timeout: 600ms
- **Tổng thời gian**: 0.1 - 0.6 giây ⚡

## 🔧 Cách kiểm tra

1. Mở Developer Console (F12)
2. Xem các log messages:
   - `Preloader: Found X critical images`
   - `Preloader: Waiting for X critical images...`
   - `Preloader: Force proceeding...`
3. Kiểm tra Network tab để xem ảnh nào đang được load
4. Đo thời gian preloader hiển thị

## 💡 Nguyên nhân chính

**Preloader chậm do:**
1. ⚠️ Thu thập quá nhiều ảnh (20-30 ảnh)
2. ⚠️ Chờ quá nhiều ảnh (10 ảnh)
3. ⚠️ Timeout quá lâu (500ms mỗi ảnh)
4. ⚠️ GitHub Pages có thể chậm (network latency)
5. ⚠️ Một số ảnh có thể bị lỗi hoặc timeout

## ✅ Giải pháp đã áp dụng

1. ✅ Giảm số ảnh thu thập (max 10)
2. ✅ Chỉ preload 5 ảnh quan trọng nhất
3. ✅ Giảm timeout (300ms)
4. ✅ Giảm force timeout (600ms)
5. ✅ Thêm logging để debug
6. ✅ Ưu tiên ảnh từ HTML preload tags

## 🎯 Kết quả

Preloader sẽ nhanh hơn **3-5 lần** sau khi tối ưu:
- **Trước**: 0.8 - 5 giây
- **Sau**: 0.1 - 0.6 giây ⚡

