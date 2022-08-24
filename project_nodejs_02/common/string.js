const contentEmail = (name,random)=>`Xin chào ${name},\nChào mừng bạn đến với Spending Management.\nĐây là mật khẩu do chúng tôi cung cấp để truy cập vào game: ${random}.\nLưu ý: sau khi truy cập vào trò chơi, bạn nên đổi mật khẩu ở phần cài đặt.`;
const mailSendCode = (random) => `Vui lòng không cung cấp mã xác minh này cho người khác: ${random}.`

//config email
const email = 'chinhtao1908@gmail.com';
const password = 'jcligjtgcjxfeqay';
const subject = 'Mật khẩu đăng nhập';
const subject_code = 'Mã xác nhận';

//config error
const jsonErr202= {
    code: 202,
    message: "yêu cầu của client đã được chấp thuận và đang trong thời gian xử lý.",
    payload: null
};

module.exports = {
    contentEmail: contentEmail,
    mailSendCode: mailSendCode,
    email: email,
    password: password,
    subject: subject,
    jsonErr202: jsonErr202,
    subject_code: subject_code
};