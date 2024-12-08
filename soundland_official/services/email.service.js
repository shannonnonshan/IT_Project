// File này mới test thôi, chưa chính thức, có khả năng xóa

// service/email.service.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Tải các biến môi trường từ tệp .env

// Cấu hình transporter của nodemailer với thông tin từ tệp .env
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Dùng dịch vụ Gmail
    auth: {
        user: process.env.EMAIL,           // Lấy email từ biến môi trường
        pass: process.env.EMAIL_PASSWORD,  // Lấy mật khẩu ứng dụng từ biến môi trường
    },
});

// Hàm gửi email
function sendEmail(recipient, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL,    // Email người gửi (dùng từ biến môi trường)
        to: recipient,              // Email người nhận
        subject: subject,           // Tiêu đề email
        text: text,                 // Nội dung email
    };

    // Gửi email
    return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
