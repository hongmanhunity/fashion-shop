const nodemailer = require("nodemailer");

const sendMail = async ({ email, html }) => {
  // Cấu hình trạm trung chuyển (SMTP của Gmail)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // Tiến hành gửi email
  const info = await transporter.sendMail({
    from: '"E-commerce Support" <no-reply@ecommerce.com>', // Đổi tên cho chuyên nghiệp nhé anh em
    to: email, // Bắn vào email của khách
    subject: "Reset Password - E-commerce App",
    html: html, // Nội dung chứa cái link reset
  });

  return info;
};

module.exports = sendMail;
