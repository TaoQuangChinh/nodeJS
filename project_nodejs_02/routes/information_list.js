var db = require('../db/database');
const config = require('../common/config');

const express = require('express');
const router = express.Router();

router.get('/list-account', (req, res) => {
    const { device } = req.query;

    db.execute('SELECT user.id, login.email, user.user_name, login.device, user.device_mobi, user.images, login.save_account FROM user INNER JOIN login ON login.email = user.email WHERE login.device = ?', [device]).then(data => {
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "Lấy danh sách tài khoản thành công!",
            payload: data[0]
        });
    }).catch(err => {
        console.log(err);
        return res.json(config.jsonErr202);
    });
});

module.exports = router;