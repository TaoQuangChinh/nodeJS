var db = require('../db/database');
const config = require('../common/config');

const express = require('express');
const router = express.Router();

router.put('/change-pass', (req, res) => {
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
        return res.json(config.jsonErr202);
    });
});

router.delete('/remove-account', (req, res) => {
    const { email, device_mobi } = req.body;
    db.execute('DELETE FROM login WHERE email = ? AND device = ?', [email, device_mobi]).then(() => {
        res.statusCode = 200;
        return res.json({
            code: 0,
            message: "Xoá tài khoản trên thiết bị thành công!",
            payload: null
        });
    }).catch(err => {
        console.log(err);
        return res.json(config.jsonErr202);
    });
});

module.exports = router;