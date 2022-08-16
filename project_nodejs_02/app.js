const string = require('./common/string');
const nodemailer = require('./node_modules/nodemailer');
const randomstring = require('./node_modules/randomstring');
var db = require('./db/database');
const express = require('express');
const apps = express();
const bodyParser = require('body-parser');

apps.use(bodyParser.urlencoded({ extended: true }));
apps.use(bodyParser.json());

apps.post("/login", (req, res) => {
    const { email, pass, save_acc } = req.body;
    db.execute('SELECT id, email, nameGame, deviceMobi, images, saveAccount FROM user WHERE email = ? AND pass = ?', [email, pass]).then(data => {
        if (data[0].length != 0) {
            db.execute('UPDATE user SET saveAccount = ? WHERE email = ?', [save_acc, email]).then(() => {
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
    const { id, email, nameGame, deviceMobi, images } = req.body;
    const randomPass = randomstring.generate(7);
    console.log(email);
    console.log(nameGame);
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
            db.execute(`INSERT INTO user (id, email, pass, nameGame, deviceMobi, images) VALUES (?,?,?,?,?,?)`, [id, email, randomPass, nameGame, deviceMobi, images]).then(() => {
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
            myEmail.sendMail(emailOption(`${email}`, `${nameGame}`, `${randomPass}`), (err, info) => {
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
    const { email, pass_confirm } = req.body;
    console.log(email,pass_confirm);
    db.execute('UPDATE user SET pass = ? WHERE email = ?', [pass_confirm, email]).then(() => {
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

apps.get('/check-device', (req, res) => {
    var user = {};
    const { device_mobi } = req.query;
    db.execute(`SELECT deviceMobi FROM user WHERE deviceMobi = ?`, [device_mobi]).then(data => {
        if (data[0].length != 0) {
            user = {
                deviceMobi: data[0][0]['deviceMobi']
            };
        }
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "kiểm tra device thành công!",
            payload: user
        });
    }).catch(err => {
        console.log(err);
        return res.json(string.jsonErr202);
    });
});

apps.get('/list-account', (req, res) => {
    db.execute('SELECT email, nameGame, images, saveAccount FROM user').then(data => {
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

const emailOption = (toMail, name, random) => {
    return {
        from: string.email,
        to: toMail,
        subject: string.subject,
        text: string.contentEmail(name, random)
    };
};

//192.168.19.91 (CT)
//192.168.0.104 (LN)
apps.listen(8000, '192.168.0.104');
module.exports = apps;