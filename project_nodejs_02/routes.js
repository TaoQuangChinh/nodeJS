const fs = require('fs');
const nodemailer = require('./node_modules/nodemailer');
const uuid = require('uuid');
var body = [];

const myEmail = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'chinhtao1908@gmail.com',
        pass: 'taoquangchinh1908'
    }
});

const emailOption = (toMail,name) =>{
    const random = uuid.v4().split('-');
    return {
        from: 'chinhtao1908@gmail.com',
        to: toMail,
        subject:'Mật khẩu mặc định',
        text: `Xin chào ${name},\nChào mừng bạn đến với cờ caro.\nĐây là mật khẩu do chúng tôi cung cấp để truy cập vào game ${random[4]}.\nLưu ý: sau khi truy cập vào trò chơi, bạn đổi mật khẩu ở phần cài đặt`
    };
};

//res: server phản hồi tới đối tượng(data server trả về cho đối tượng)
//req: đối tượng phản hồi tới server(data đối tượng gửi lên server)
const handleRequestListener = (req, res) => {
    var url = req.url;

    req.on('data', (chunk) => {
        body.push(chunk);
    });
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const { id, name, pass, name_game } = JSON.parse(parsedBody);
        if (url === '/login') {
            const result =  dataRegister("",name,pass,"");
            handleWriteFile('data_login.txt', JSON.stringify(result));
        } else if (url === '/register') {
            const result =  dataRegister(id,name,pass,name_game);
            handleWriteFile('data_register.txt', JSON.stringify(result));
            myEmail.sendMail(emailOption(`${name}`,`${name_game}`),(err,info)=>{
                if(err){
                    return console.log(err);
                }else{
                    
                }
            });
        }
        body = [];
    });
};

const dataRegister = (id,name,pass,nameGame) =>{
    return {
        id: id,
        userName: name,
        passWord: pass,
        name_game: nameGame
    };
};

const logText = 'Test log...';

const handleWriteFile = (nameFile, dataFile) => fs.writeFile(nameFile, dataFile,
    (err) => {
        if (err) {
            res.statusCode = 404;
            res.write("404 Not Found");
            return res.end();
        }
    });

//Method 1
// exports.handle = handleRequestListener;
// exports.log = logText;

//Method 2
module.exports = {
    handle: handleRequestListener,
    logs: logText
};