const nodemailer = require('nodemailer');
const string = require('../common/string');

//config error
const jsonErr202= {
    code: 202,
    message: string.time_client,
    payload: null
};

//account email
const myEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: string.email,
        pass: string.password
    }
});

module.exports = {
    jsonErr202: jsonErr202,
    myEmail: myEmail,
};