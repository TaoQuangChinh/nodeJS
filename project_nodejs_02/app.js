const express = require('express');
const apps = express();
const bodyParser = require('body-parser');

const saveUser = require('./routes/save_user');
const checkUser = require('./routes/check_user');
const userFunc = require('./routes/user_function');
const inforList = require('./routes/information_list');

apps.use(bodyParser.urlencoded({ extended: true }));
apps.use(bodyParser.json());

apps.use('/save',saveUser);
apps.use('/check',checkUser);
apps.use('/function',userFunc);
apps.use('/list',inforList);

//192.168.19.91 (CT)
//192.168.0.104 (LN)
apps.listen(8000, '192.168.19.91');