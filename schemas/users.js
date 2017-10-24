//数据库结构设置

var mongoose = require('mongoose');

//用户的表结构
module.exports = new mongoose.Schema({
    //username
    username:String,
    //password
    password:String,
    //isAdmin
    isAdmin:{
        type:Boolean,
        default:false
    }

})