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
    const { email, pass } = req.body;
    db.execute('SELECT * FROM user WHERE email = ? AND pass = ?', [email, pass]).then(data => {
        if (data[0].length != 0) {
            res.statusCode = 200;
            return res.json({
                code: 0,
                message: "đăng nhập thành công!",
                payload: null
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
    console.log(images);
    db.execute(`INSERT INTO user VALUES (?,?,?,?,?)`, [id, email, randomPass, nameGame, deviceMobi]).then(() => {
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
});

apps.get('/check-device', (req, res) => {
    var user = {};
    const { device_mobi } = req.query;
    db.execute(`SELECT * FROM user`).then(data => {
        for (let arr of data[0]) {
            if (arr['deviceMobi'] === device_mobi) {
                user = {
                    id: arr['id'],
                    email: arr['email'],
                    nameGame: arr['nameGame'],
                    deviceMobi: arr['deviceMobi']
                };
            }
            break;
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
    db.execute('SELECT * FROM user').then(data => {
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

apps.listen(8000, '192.168.0.104');
module.exports = apps;