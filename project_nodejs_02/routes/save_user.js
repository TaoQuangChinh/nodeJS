const randomstring = require('randomstring');
const string = require('../common/string');
const config = require('../common/config');
var db = require('../db/database');

const express = require('express');
const router = express.Router();

router.post("/login", (req, res) => {
    const { email, pass, save_acc, device_mobi } = req.body;
    db.execute('SELECT id, email, user_name, device_mobi, images FROM user WHERE email = ? AND pass = ?', [email, pass]).then(check => {
        if (check[0].length != 0) {
            db.execute('SELECT email, device FROM login WHERE email = ? AND device = ?', [email, device_mobi]).then(data => {
                if (data[0].length === 0) {
                    db.execute('INSERT INTO login (device,email,save_account) VALUES (?,?,?)', [device_mobi, email, save_acc]);
                } else {
                    db.execute('UPDATE login SET save_account = ? WHERE email = ? AND device = ?', [save_acc, data[0][0]['email'], data[0][0]['device']]);
                }
            });
            res.statusCode = 200;
            return res.json({
                code: 0,
                message: "Đăng nhập thành công!",
                payload: check[0][0]
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
        return res.json(config.jsonErr202);
    });
});

router.post('/register', (req, res) => {
    const { id, email, images, device_mobi } = req.body;
    const randomPass = randomstring.generate(7);

    db.execute('SELECT device_mobi FROM user WHERE device_mobi = ?', [device_mobi]).then(data => {
        if (data[0].length != 0) {
            return res.json({
                code: 501,
                message: 'Thiết bị đã được đăng ký bởi tài khoản khác.',
                payload: null
            });
        } else {
            db.execute('SELECT email FROM user WHERE id = ?', [id]).then(data => {
                if (data[0][0]['email'] != null) {
                    return res.json({
                        code: 501,
                        message: 'Thông tin tài khoản đã tồn tại.',
                        payload: null
                    });
                }
                db.execute(`UPDATE user SET email = ?, pass = ?, images = ?, device_mobi = ? WHERE id = ?`, [email, randomPass, images, device_mobi, id]).then(() => {
                    res.statusCode = 200;
                    return res.json({
                        code: 0,
                        message: "Đăng ký tài khoản thành công!",
                        payload: null
                    });
                })
                db.execute('SELECT user_name,pass FROM user WHERE id = ?', [id]).then(data => {
                    const setupEmail = {
                        from: string.email,
                        to: `${email}`,
                        subject: string.subject,
                        text: string.contentEmail(data[0][0]['user_name'], data[0][0]['pass'])
                    };
                    config.myEmail.sendMail(setupEmail, (err, info) => {
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
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json(config.jsonErr202);
    });
});

module.exports = router;