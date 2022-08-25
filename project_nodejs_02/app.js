const string = require('./common/string');
const nodemailer = require('./node_modules/nodemailer');
const randomstring = require('./node_modules/randomstring');
var db = require('./db/database');
const express = require('express');
const apps = express();
const bodyParser = require('body-parser');
const crypto = require("crypto");

apps.use(bodyParser.urlencoded({ extended: true }));
apps.use(bodyParser.json());

apps.post("/login", (req, res) => {
    const { email, pass, save_acc, device_mobi } = req.body;
    db.execute('SELECT email FROM user WHERE email = ? AND pass = ?', [email, pass]).then(check => {
        if (check[0].length != 0) {
            db.execute('UPDATE user SET save_account = ?, device_mobi = ? WHERE email = ?', [save_acc, device_mobi, email]).then(() => {
                db.execute('SELECT id, email, user_name, device_mobi, images, save_account FROM user WHERE email = ?', [email]).then(data => {
                    res.statusCode = 200;
                    return res.json({
                        code: 0,
                        message: "Đăng nhập thành công!",
                        payload: data[0][0]
                    });
                });
            });
        } else {
            return res.json({
                code: 400,
                message: "Tài khoản email hoặc mật khẩu sai.",
                payload: null
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.post('/register', (req, res) => {
    const { id, email, images } = req.body;
    const randomPass = randomstring.generate(7);
    db.execute('SELECT email FROM user WHERE email = ?', [email]).then(data => {
        if (data[0].length != 0) {
            if (data[0][0]['email'] === email) {
                return res.json({
                    code: 501,
                    message: 'Tài khoản email đã được đăng ký.',
                    payload: null
                });
            }
        } else {
            db.execute(`UPDATE user SET email = ?, pass = ?, images = ? WHERE id = ?`, [email, randomPass, images, id]).then(() => {
                res.statusCode = 200;
                return res.json({
                    code: 0,
                    message: "Đăng ký tài khoản thành công!",
                    payload: null
                });
            })
            db.execute('SELECT user_name,pass FROM user WHERE id = ?', [id]).then(data => {
                myEmail.sendMail(emailOption(`${email}`, string.contentEmail(data[0][0]['user_name'], data[0][0]['pass']), string.subject), (err, info) => {
                    if (err) {
                        console.log(err);
                        return res.json({
                            code: 501,
                            message: "Có một lỗi xảy ra trong quá trình gửi mail.",
                            payload: null
                        });
                    }
                });
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.post('/check-user', (req, res) => {
    const { id } = req.body;
    db.execute('SELECT user_name FROM user WHERE id = ?', [id]).then(data => {
        if(data[0].length != 0){
            res.statusCode = 200;
            res.json({
                code: 0,
                message: 'Kiểm tra thông tin thành công!',
                payload: data[0][0]['user_name']
            });
        }else{
            return res.json({
                code: 400,
                message: 'Người dùng không tồn tại.',
                payload: null
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.post('/send-code', (req, res) => {
    const { email } = req.body;
    crypto.randomInt(0, 100000, (err, random) => {
        const randomNum = random.toString().padStart(6, '0');
        if (err) {
            console.log(err);
            return res.json({
                code: 501,
                message: "Có một lỗi xảy ra trong quá trình gửi mã.",
                payload: null
            });
        }
        myEmail.sendMail(emailOption(`${email}`, string.mailSendCode(randomNum), string.subject_code), (err, infor) => {
            if (err) {
                console.log(err);
                return res.json({
                    code: 501,
                    message: "Có một lỗi xảy ra trong quá trình gửi mã.",
                    payload: null
                });
            }
            return res.json({
                code: 0,
                message: 'Chúng tôi đã gửi mã xác thực vào email của bạn!',
                payload: {
                    verifi_code: randomNum
                }
            });
        });
    });
});

apps.put('/change-pass', (req, res) => {
    const { email, pass_confirm } = req.body;
    db.execute('UPDATE user SET pass = ? WHERE email = ?', [pass_confirm, email]).then(() => {

        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "Cập nhập thông tin thành công!",
            payload: null
        });
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.delete('/remove-account', (req, res) => {
    const { id } = req.body;
    db.execute('UPDATE user SET device_mobi = ? WHERE id = ?', [null, id]).then(() => {
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "Xoá tài khoản trên thiết bị thành công!",
            payload: null
        });
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.get('/check-device', (req, res) => {
    var dataUser = null;
    const { device_mobi } = req.query;
    db.execute(`SELECT id, email, user_name, device_mobi, images, save_account FROM user WHERE device_mobi = ?`, [device_mobi]).then(data => {
        if (data[0].length === 1) {
            if (data[0][0]['save_account'] === 1) {
                dataUser = data[0][0];
            }
        }
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "Kiểm tra device thành công!",
            payload: {
                total_device_login: data[0].length,
                data_user: dataUser
            }
        });
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.get('/list-account', (req, res) => {
    const { device } = req.query;

    db.execute('SELECT id, email, user_name, device_mobi, images, save_account FROM user WHERE device_mobi = ?', [device]).then(data => {
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "Lấy danh sách tài khoản thành công!",
            payload: data[0]
        });
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

const myEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: string.email,
        pass: string.password
    }
});

const emailOption = (toMail, content, subject) => {
    return {
        from: string.email,
        to: toMail,
        subject: subject,
        text: content
    };
};

//192.168.19.91 (CT)
//192.168.0.104 (LN)
apps.listen(8000, '192.168.19.91');
module.exports = apps;