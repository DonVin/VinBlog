/* 
  应用程序的启动（入口）文件
*/

//加载express模块
var express = require('express');
//加载模块处理模块（swig视图引擎）
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser。用来处理post提交过来的数据
var bodyParser = require('body-parser');
//加载cookies模块
var Cookies = require('cookies');
//引入model，用户模型
var User = require('./models/User');
//创建app应用 =>NodeJS Http.createServer();
var app = express();

//设置静态文件托管，静态文件处理
//当用户访问的url以/public开始，则返回对应的__dirname+'/public'下的文件
//第一个参数设置虚拟的静态目录：'/public'：为了给静态资源文件创建一个虚拟的文件前缀（实际上文件系统中并不存在），可以使用 express.static 函数指定一个虚拟的静态目录
//第二个参数设置静态文件目录：express.static(__dirname+'/public')：localhost:8888/index.js可直接加载public下的文件，不需要把静态目录作为url的一部分，express会按照设置的__dirname+'/public'，会直接加载public下的文件
//所以，在加载引用静态文件的目录时，要在链接中加‘/public/’
app.use('/public',express.static(__dirname+'/public'));

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数表示模板引擎的名称，同时也是模块文件的后缀
//第二个参数表示用于解析处理B模块内容的方法,配置render输出的文件的解释器，编译
app.engine('html',swig.renderFile);
//设置模块文件存放的目录，第一个参数必须是views，第二个参数是录
app.set('views',__dirname+'/views');
//注册所使用的模块引擎，第一个参数必须是view engine
//第二个参数和app.engine这个方法中定义的模块引擎的名称(即第一个参数)是一致的。
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

//调用中间件
//bodyparser设置
//urlencoded()会在app的req上增加一个属性body，body里面保存的是post传过来的参数。
app.use(bodyParser.urlencoded({}))

//cookies设置
//任何时候只要用户来访问网站，都将访问这个中间件
app.use( function(req,res,next){
  //调用cookies方法。将对象加载入request内(服务器为浏览器请求头创建cookie，所以使用req)
  //new cookies()创建cookie
  req.cookies = new Cookies(req,res);
  
  //入口文件
  //解析登陆的cookies信息(后台获取cookie进行解析)
  //需要设置一个能被所有路由访问的变量，方法是为req添加一个自定义属性，将变量添加到http请求中，则能被路由访问到
  req.userInfo = {};
  //cookies.get()：cookies方法，获取cookie，将从浏览器发送过来的cookie请求中的标题中提取具有给定名称的cookie，若存在返回其值
  if(req.cookies.get('userInfo')){
    try{
      //将cookies进行解析，字符串转为对象
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));

      //cookie中没有存储isAdmin，需要从数据库中获取当前登陆用户的数据库类型，来判断是不是管理员
      //findById(req.userInfo._id)找到用户的id，then得到查找到的值
      User.findById(req.userInfo._id).then(function(userInfo){
        //将用户登录状态下的isAdmin转为布尔值
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
        next();
        
      })
    }catch(err){
      next();
    }
  }else{
    next();
  }
  
} );

/*
  //首页
  //req:request
  //res:response
  //函数
  //动态文件处理
  app.get('/',function(req,res,next){
      // res.send('welcome');
      // 读取views目录下的指定文件，解析并返回给客户端
      // 第一个参数：表示模块的文件，相对于views目录 views/index.html
      // 第二个参数：传递给模板使用的数据
      res.render('index.html');
  })

  // app.get('/main.css',function(req,res,next){
  //     res.setHeader('content-type','text/css');
  //     res.send('body{color:red;}');
  // })

*/

//根据不同的功能划分模块
//中间件：收到请求之后，发送响应之前这个阶段执行的一些函数
//中间件的原型：function(req,res,next){}
//next:驱动中间件调用链的函数，若想让后面的中间件继续处理请求，则需要调用next方法。
//为不同的模块路径安装中间件，当以该路径进行访问时，都会用到该中间件。eg：若你为/admin设置了中间件，则‘/admin/xxx’ 被访问时都会应用该中间件
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

//连接数据库
//bin vin$ mongod --dbpath=/Users/vin/Documents/Tww/Programming/Web/Node/node-Blog/db --port=27018
//第一个参数：
//第二个参数：
mongoose.connect('mongodb://localhost:27018/blog',function(err){
  if(err){
    console.log('Database connection failed');
  }else{
    console.log('Database connection succeed');
    //监听http请求
    app.listen(8888);
  }
});


//用户发送http请求=>url=>找到匹配的规则=>执行指定的绑定函数，返回对应数据给用户
// ／public => 静态 => 直接读取指定目录下的文件，返回给用户
// 动态=>处理业务逻辑，加载模板，解析模板=>返回数据给用户