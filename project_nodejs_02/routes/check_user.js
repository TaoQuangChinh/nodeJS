const string = require('../common/string');
const config = require('../common/config');
var db = require('../db/database');
const crypto = require("crypto");

const express = require('express');
const router = express.Router();

router.post('/check-user', (req, res) => {
    const { id } = req.body;
    db.execute('SELECT user_name FROM user WHERE id = ?', [id]).then(data => {
        if (data[0].length != 0) {
            res.statusCode = 200;
            res.json({
                code: 0,
                message: 'Kiểm tra thông tin thành công!',
                payload: data[0][0]['user_name']
            });
        } else {
            return res.json({
                code: 400,
                message: 'Người dùng không tồn tại.',
                payload: null
            });
        }
    }).catch(err => {
        console.log(err);
        return res.json(config.jsonErr202);
    });
});

router.post('/send-code', (req, res) => {
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
        } else {
            const setupEmail = {
                from: string.email,
                to: `${email}`,
                subject: string.subject_code,
                text: string.mailSendCode(randomNum)
            };
            config.myEmail.sendMail(setupEmail, (err, infor) => {
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
        }
    });
});

router.get('/check-device', (req, res) => {
    var dataUser = null;
    const { device_mobi } = req.query;
    db.execute('SELECT user.id, login.email, user.user_name, login.device, user.images, login.save_account FROM user INNER JOIN login ON login.email = user.email WHERE login.device = ?', [device_mobi]).then(data => {
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
        return res.json(config.jsonErr202);
    });
});

module.exports = router;