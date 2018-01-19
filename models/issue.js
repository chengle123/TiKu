const Sequelize= require('sequelize');
var seq = require('./config.js').seq;

var issue = seq.define('issue', {
    id: {
        autoIncrement:true,
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        comment: "编码 自增值且是主键"
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    qid:{
        type: Sequelize.INTEGER,
        allowNull:true
    },
    select:{
        type: Sequelize.STRING,
        allowNull:true
    },
    resolve:{
        type: Sequelize.STRING,
        allowNull:true
    },
    answer:{
        type: Sequelize.STRING,
        allowNull:true
    },
}, {
    freezeTableName: true, // Model 对应的表名将与model名相同,
    timestamps: false
});

module.exports = issue;