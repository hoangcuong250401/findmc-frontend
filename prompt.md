Use case Xác minh danh tính
Mô tả vắn tắt use case: cho phép người dùng (MC/ khách book MC) xác minh danh tính.
• Luồng sự kiện:
o Luồng cơ bản:

1. Use case bắt đầu khi người dùng bấm vào tùy chọn “Xác minh danh tính” trên màn hình thiết lập. Hệ thống hiển thị màn hình tổng quan hướng dẫn các bước cần làm để xác minh danh tính: chụp hình khuôn mặt (bước 1), sau đó chụp CCCD trước, mặt sau (bước 2), sau đó xác nhận thông tin CCCD (bước 3).
2. Người dùng chọn “Bắt đầu”, hệ thống hiện màn hình chụp ảnh khuôn mặt người dùng.
3. Người dùng bấm chụp, hệ thống lưu lại ảnh khuôn mặt và chuyển sang bước 2: hệ thống hiện màn hình chụp ảnh CCCD mặt trước.
4. Người dùng bấm chụp, hệ thống lưu lại ảnh CCCD mặt trước và hiện màn hình chụp ảnh CCCD mặt sau.
5. Người dùng bấm chụp, hệ thống lưu lại ảnh CCCD mặt sau và chuyển sang bước 3: hiển thị thông tin đầy đủ của CCCD.
6. Người dùng bấm “Xác nhận”, hệ thống cập nhật trạng thái xác thực danh tính trong bảng user thành đã xác thực và gửi thông báo toast đến người dùng “Bạn đã xác thực danh tính thành công”. Use case kết thúc.
   o Luồng rẽ nhánh:
7. Tại bước 1 của luồng cơ bản, nếu người dùng bấm nút “Quay lại” khi đang đứng tại màn hướng dẫn tổng quan, use case kết thúc.
8. Tại bước 3 của luồng cơ bản, nếu hệ thống không nhận diện được ảnh khuôn mặt do người dùng chụp, hệ thống yêu cầu người dùng thực hiện lại bước 3 của luồng cơ bản.
9. Tại bước 4 của luồng cơ bản, nếu hệ thống không nhận diện được ảnh CCCD mặt trước do người dùng chụp, hệ thống yêu cầu người dùng thực hiện lại bước 4 của luồng cơ bản.
10. Tại bước 5 của luồng cơ bản, nếu hệ thống không nhận diện được ảnh CCCD mặt sau do người dùng chụp, hệ thống yêu cầu người dùng thực hiện lại bước 5 của luồng cơ bản.
11. Tại bước một trong các bước 2, 3, 4, 5, 6 của luồng cơ bản, nếu người dùng bấm “Quay lại”, hệ thống quay lại bước trước đó.
12. Tại bước một trong các bước 3, 4, 5 của luồng cơ bản, sau khi bấm chụp, nếu người dùng bấm “Chụp lại”, hệ thống hiện màn hình chụp của bước đó cho người dùng chụp lại.
13. Tại bất kỳ thời điểm nào trong quá trình thực hiện use case nếu không kết nối được với cơ sở dữ liệu thì hệ thống sẽ hiển thị thông báo “Lỗi kết nối!” và use case kết thúc.
    • Các yêu cầu đặc biệt:
    Người dùng đã đăng nhập
    • Tiền điều kiện:
    Không có
    • Hậu điều kiện:
    Không có
    • Điểm mở rộng:
    Không có
