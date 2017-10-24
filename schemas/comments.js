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

    //关联字段 - 内容的id
    content:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    },

    //关联字段 - 项目的id
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },

    //创建时间
    addTime:{
        type: Date,
        default: Date.now
    },

    //修改时间
    modification:{
        type: Date,
        default: new Date()
    },

    //评论分类
    sort: String,

    //所评论文章或项目的标题
    title: String,

    //评论内容
    comment:{
        type: String,
        default: '',
    },

    ip: {
        type: String,
        default: '',
    },

    address: {
        type: String,
        default: '',
    }

})