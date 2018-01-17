const Sequelize = require('sequelize');
const seq = new Sequelize('answer_gather','root','',{
        host: '127.0.0.1',
        port: 3306,
        dialect:'mysql',
        timezone: '+08:00',
    })

module.exports.seq = seq;