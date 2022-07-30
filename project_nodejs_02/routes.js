const fs = require('fs');

//res: server phản hồi tới đối tượng(data server trả về cho đối tượng)
//req: đối tượng phản hồi tới server(data đối tượng gửi lên server)
const handleRequestListener = (req,res)=>{
    var url = req.url;
    const method = req.method;
    if(url === '/'){
        res.setHeader('Content-type','form');
    res.write('<html>');
    res.write('<body><form action="/mess" method="POST"><input type="text" name="maessage"><button type="submit">SEND</button></form></body>');
    res.write('</html>');
    return res.end();
    }
    if(url === '/mess' && method === "POST"){
        const body = [];
        req.on('data',(chunk)=>{
            body.push(chunk);
        });
        return req.on('end',()=>{
            const parsedBody = Buffer.concat(body).toString();
            const mess = parsedBody.split('=')[1];
            fs.writeFile('data_login.txt',mess,(err)=>{
                res.statusCode = 302;
                res.setHeader('Location','/');
                return res.end();
            });
        });
    }
    return res.end();
};

const logText = 'Test log...';

//Method 1
// exports.handle = handleRequestListener;
// exports.log = logText;

//Method 2
module.exports = {
    handle: handleRequestListener,
    logs: logText
};