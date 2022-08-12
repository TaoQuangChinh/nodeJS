const http = require('http');
const string = require('./common/string');
const nodemailer = require('./node_modules/nodemailer');
const randomstring = require('./node_modules/randomstring');
var db = require('./db/database');
const express = require('express');
const apps = express();

var body = [];

apps.post("/login", (req, res) => {
    req.on('data', (chunk) => {
        body.push(chunk);
    });
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const { email, pass } = JSON.parse(parsedBody);
        db.execute('SELECT email, pass FROM user').then(data => {
            for (let arr of data[0]) {
                if (arr['email'] === email && arr['pass'] === pass) {
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
            }
        }).catch(err => {
            console.log(err);
            return res.json(string.jsonErr202);
        });
        body = [];
    });
});

apps.post('/register', (req, res) => {
    req.on('data', (chunk) => {
        body.push(chunk);
    });
    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        const { id, email, name_game, device_mobi } = JSON.parse(parsedBody);
        const randomPass = randomstring.generate(7);

        db.execute(`INSERT INTO user VALUES (?,?,?,?,?)`, [id, email, randomPass, name_game, device_mobi]).then(() => {
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
        myEmail.sendMail(emailOption(`${email}`, `${name_game}`, `${randomPass}`), (err, info) => {
            if (err) {
                console.log(err);
                return res.json({
                    code: 501,
                    message: "có một lỗi xảy ra trong quá trình gửi mail.",
                    payload: null
                });
            }
        });
        body = [];
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
                    nick_name: arr['nameGame'],
                    mobi_device: arr['deviceMobi']
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
    body = [];
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

const server = http.createServer(apps);
server.listen(8000);