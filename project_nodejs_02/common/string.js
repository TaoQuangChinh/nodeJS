const contentEmail = (name,random)=>`Xin chào ${name},\nChào mừng bạn đến với cờ caro.\nĐây là mật khẩu do chúng tôi cung cấp để truy cập vào game: ${random}.\nLưu ý: sau khi truy cập vào trò chơi, bạn nên đổi mật khẩu ở phần cài đặt`;

//config email
const email = 'chinhtao1908@gmail.com';
const password = 'jcligjtgcjxfeqay';
const subject = 'Mật khẩu đăng nhập';

//config error
const jsonErr202= {
    code: 202,
    message: "yêu cầu của clinet đã được chấp thuận và đang trong thời gian xử lý.",
    payload: null
};

module.exports = {
    contentEmail: contentEmail,
    email: email,
    password: password,
    subject: subject,
    jsonErr202: jsonErr202
};