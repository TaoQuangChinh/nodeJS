var mySQL = require('../node_modules/mysql2');

var create = mySQL.createPool({
    host:'localhost',
    user:'root',
    database: 'project_game',
    password: 'chinhFPT1908'
});

module.exports = create.promise();