//首页     /user
//用户注册接口 /user/register
//用户登陆接口 /user/login
//评论获取 /user/comment
//评论提交 /user/comment/post
//获取文章评论 /article/comment
//获取项目评论 /project/comment
//获取文章内容 /user/article


var express = require('express');
var router = express.Router();
//引入数据库
//数据库返回的是构造函数，内有很多方法，可以通过方法像操作对象一样操作数据库
var User = require('../models/User');
var Content = require('../models/Content');
var Comment = require('../models/Comment');
var Project = require('../models/Project');


//统一返回格式
var responseData;

router.use(function(req,res,next){
    responseData = {
        code:0,     //错误码：0代表无错误
        message:'', //null ：代表无错误
        userInfo:'',//用户信息
        article:'',//文章内容
        comment:'',//评论
    }
    next();
})

//user register
//注册逻辑
    //1、用户名不能为空 2、密码不能为空  3、两次输入密码一致
    //1、用户名是否已经被注册（数据库查询）
router.post('/user/register',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    var confirm = req.body.confirm;

    //用户名是否为空
    if( username == ''){
        responseData.code = 1;
        responseData.message = 'Username cannot be empty！';
        //将提示数据返回给前端
        res.json(responseData);
        return;
    }
    //密码不能为空
    if( password == ''){
        responseData.code = 2;
        responseData.message = 'Password cannot be empty！';
        res.json(responseData);
        return;
    }
    //两次输入密码不一致
    if( password != confirm){
        responseData.code = 3;
        responseData.message = 'The code you enter twice must be the same！';
        res.json(responseData);
        return;
    }

    //用户名是否被注册，如果数据库中已经存在与注册的用户名同名的数据，表示已经被注册
    //findOne:查询条件
    //User.findOne()返回一个promise对象
    //promise必须完成（返回一个值）或者拒绝（返回一个原因）
    //promise.then()完成时返回的值
    //promise.catch()拒绝时返回的值
    User.findOne({
        //设置查询条件
        username:username,
    }).then(function(userInfo){
        if( userInfo ){
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = 'The username has been registered';
            res.json(responseData);
            return;
        }
        //保存用户注册信息到数据库中
        //创建出来的对象代表数据库，每一个记录代表一个对象
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function(newUserInfo){//第二个then返回值代表新用户信息
        
        //注册成功
        responseData.code = 0;
        responseData.message = 'register successful';
        
        responseData.userInfo = {
            _id:newUserInfo._id,
            username:newUserInfo.username
        };
        
        //设置刷新后传递的cookies信息
        //cookies.set():cookies方法，在相应中设置cookie，返回上下文以允许链接(服务器为浏览器请求头设置向后端发送cookie，所以使用req)
        
        req.cookies.set('userInfo',JSON.stringify({
            //JSON.stringify:保存成字符串
            _id:newUserInfo._id,
            username:newUserInfo.username
        }));
        res.json(responseData);
    });

})

//user login
router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;

    //用户名或者密码为空
    if( username == '' || password == '' ){
        responseData.code = 1;
        responseData.message = 'username and password cannot be empty !';
        res.json(responseData);
        return;
    }

    //查询数据库中相同用户名和密码的纪录是否存在，如果存在则登陆成功
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        //userInfo是数据库中的查询结果
        if( !userInfo ){
            responseData.code = 2;
            responseData.message = 'username or password wrong !';
            res.json(responseData);
            return;
        }
        //用户名和密码正确，登陆成功
        responseData.code = 0;
        responseData.message = 'login successful !';
        responseData.userInfo = {
            _id:userInfo._id,
            username:userInfo.username
        };
        //设置刷新后传递的cookies信息
        //cookies.set():cookies方法，在相应中设置cookie，返回上下文以允许链接(自己理解：服务器为浏览器请求头设置向后端发送cookie，所以使用req)
        //老师解释：服务器发送一个cookie信息到浏览器，浏览器得到信息进行保存，当进行访问，每次都将发送一个cookie信息至客户端
        req.cookies.set('userInfo',JSON.stringify({
            //JSON.stringify:保存成字符串
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
    });
})

//user outLogin
router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    responseData.code = 0;
    res.json(responseData);
})


//文章内容获取 Content
// /user/article
router.post('/user/article',function(req,res,next){
    var id = req.body.id;
    // console.log(id);

    Content.find({
        _id: id
    }).then((content)=>{
        responseData.article = content[0];
        res.json(responseData);
        // console.log(content[0])
    })
})

// 评论提交
// /article/comment
router.post('/article/comment',function(req,res,next){
    let articleId = req.body.articleId;
    let ip = req.body.ip;
    let commentVal = req.body.commentVal;
    let address = req.body.address;
    let content = '';

    /*需要储存的数据
        *sort: article or project
        *title: name
        *ip: ip地址
        *address: 省份城市
        *addTime: create time
        *modification:modification time
        *author:author
        *commentVal：commentVal
    */

    res.json(responseData)

    Content.find({
        _id: articleId
    }).then((result)=>{
        content = result[0]._id

        return new Comment({
            sort: "Acticle",
            ip: ip,
            address: address,
            comment: commentVal,
            user: req.userInfo,
            content: content
        }).save()
    })
})


module.exports = router;