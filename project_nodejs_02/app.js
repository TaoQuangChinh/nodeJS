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
    db.execute('SELECT id, email, nameGame, deviceMobi, images, saveAccount FROM user WHERE email = ? AND pass = ?', [email, pass]).then(data => {
        if (data[0].length != 0) {
            db.execute('UPDATE user SET saveAccount = ?, deviceMobi = ? WHERE email = ?', [save_acc, device_mobi, email]).then(() => {
                res.statusCode = 200;
                return res.json({
                    code: 0,
                    message: "đăng nhập thành công!",
                    payload: data[0][0]
                });
            }).catch(err => {
                console.log(err);
                return res.json(string.jsonErr202);
            });
        } else {
            return res.json({
                code: 400,
                message: "tài khoản email hoặc mật khẩu sai.",
                payload: null
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.post('/register', (req, res) => {
    const { id, email, nameGame, images } = req.body;
    const randomPass = randomstring.generate(7);
    db.execute('SELECT email,nameGame FROM user WHERE email = ? OR nameGame = ?', [email, nameGame]).then(data => {
        if (data[0].length != 0) {
            if (data[0][0]['email'] === email) {
                return res.json({
                    code: 501,
                    message: 'Tài khoản email đã được đăng ký.',
                    payload: null
                });
            } else if (data[0][0]['nameGame'] === nameGame) {
                return res.json({
                    code: 501,
                    message: 'Nick name đã tồn tại, vui lòng chọn tên khác.',
                    payload: null
                });
            }
        } else {
            db.execute(`INSERT INTO user (id, email, pass, nameGame, images) VALUES (?,?,?,?,?)`, [id, email, randomPass, nameGame, images]).then(() => {
                res.statusCode = 200;
                return res.json({
                    code: 0,
                    message: "tạo tài khoản thành công!",
                    payload: null
                });
            }).catch(err => {
                console.log(err);
                return res.json(string.jsonErr202);
            });
            myEmail.sendMail(emailOption(`${email}`, string.contentEmail(nameGame, randomPass), string.subject), (err, info) => {
                if (err) {
                    console.log(err);
                    return res.json({
                        code: 501,
                        message: "có một lỗi xảy ra trong quá trình gửi mail.",
                        payload: null
                    });
                }
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.post('/change-pass', (req, res) => {
    const { id, pass_confirm } = req.body;
    db.execute('UPDATE user SET pass = ? WHERE id = ?', [pass_confirm, id]).then(() => {

        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "cập nhập thông tin thành công!",
            payload: null
        });
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.post('/send-code', (req, res) => {
    const { email } = req.body;
    crypto.randomInt(0, 100000, (err, random) => {
        if (err) {
            console.log(err);
            return res.json({
                code: 501,
                message: "có một lỗi xảy ra trong quá trình gửi mail.",
                payload: null
            });
        }
        myEmail.sendMail(emailOption(`${email}`, string.mailSendCode(random), string.subject_code), (err, infor) => {
            if (err) {
                console.log(err);
                return res.json({
                    code: 501,
                    message: "có một lỗi xảy ra trong quá trình gửi mail.",
                    payload: null
                });
            }
            return res.json({
                code: 0,
                message: 'gửi mã xác nhận thành công!',
                payload: null
            });
        });
    });
});

apps.get('/check-device', (req, res) => {
    var dataUser = {};
    const { device_mobi } = req.query;
    db.execute(`SELECT id, email, nameGame, deviceMobi, images, saveAccount FROM user WHERE deviceMobi = ?`, [device_mobi]).then(data => {
        if (data[0].length == 1) {
            dataUser = data[0][0];
        }
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "kiểm tra device thành công!",
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
    db.execute('SELECT id, email, nameGame, deviceMobi, images, saveAccount FROM user').then(data => {
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "lấy danh sách tài khoản thành công!",
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