//内容的结构设置

var mongoose = require('mongoose');

//内容的表结构
module.exports = new mongoose.Schema({
    //关联字段 - 内容分类的id
    category:{
        //类型:objectid类型
        type: mongoose.Schema.Types.ObjectId,
        //引用Category数据库的内容
        ref: 'Category',
    },

    //关联字段 - 用户的id
    user:{
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用User数据库的内容
        ref: 'User'
    },

    //创建时间
    addTime:{
        type: Date,
        default: Date.now()
    },

    //修改时间
    modification:{
        type: Date,
        default: new Date()
    },

    //点击量，阅读数
    views:{
        type: Number,
        default: 0,
    },

    //项目标题
    title: String,

    //简介
    description:{
        type: String,
        default: '',
    },

    //内容
    content:{
        type: String,
        default: '',
    }

})