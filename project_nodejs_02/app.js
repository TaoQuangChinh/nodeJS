const http = require('http');
const string = require('./common/string');
const nodemailer = require('./node_modules/nodemailer');
const randomstring = require('./node_modules/randomstring');
var db = require('./db/database');
var body = [];

const express = require('express');
const apps = express();

apps.use((req,res,next)=>{
        var url = req.url;
    
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const { id, email, pass, name_game, device_mobi } = JSON.parse(parsedBody);
    
            if (url === '/login') {
                db.execute('SELECT * FROM user').then(data =>{
                    for(let arr of data[0]){
                        if(arr['email'] === email && arr['pass'] === pass){
                            console.log('success!!!');
                            res.statusCode(200).send({
                                'code': 0,
                                'message': success
                            });
                        }else{
                            console.log('fail!!!');
                        }
                    }
                }).catch(err =>{
                    console.log(err);
                });
            } else if (url === '/register') {
                const randomPass = randomstring.generate(7);
                db.execute(`INSERT INTO user VALUES (?,?,?,?,?)`,[id,email,randomPass,name_game,device_mobi]).catch(err =>{
                    console.log(err);
                });
                myEmail.sendMail(emailOption(`${email}`,`${name_game}`,`${randomPass}`),(err,info)=>{
                    if(err){
                        res.statusCode = 404;
                        res.write("404 Not Found");
                        return res.end();
                    }
                });
            }
            body = [];
        });
});

const myEmail = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: string.email,
        pass: string.password
    }
});

const emailOption = (toMail,name,random) =>{
    return {
        from: string.email,
        to: toMail,
        subject:string.subject,
        text: string.contentEmail(name,random)
    };
};    

const server = http.createServer(apps);
server.listen(8000);