//管理模块
/*
        /   首页
    用户管理
        /user   用户列表
    分类管理
        /category   分类列表
        /category/add   分类添加
        /category/delete   分类修改
        /category/edit   分类修改
        /category/delete   分类删除
    文章内容管理
        /content    内容列表
        /content/add    内容添加
        /content/edit    内容修改
        /content/delete    内容删除
        /content/comment   内容评论
        /content/comment/delete   内容评论删除
    评论内容管理
        /comment    评论列表
        /comment/delete    评论删除
    项目管理
        /project  项目列表
        /project/add  项目添加
        /project/edit    项目修改
        /project/delete    项目删除
        /project/comment   内容评论
        /project/comment/delete   内容评论删除
*/
var express = require('express');
var router = express.Router();
//引入数据库模板
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var Comment = require('../models/Comment');
var Project = require('../models/Project');


router.use(function(req,res,next){

    if( !req.userInfo.isAdmin ){
        //如果当前用户为非管理员用户
        res.send('Only admin are allowed to enter ！');
        return;
    }
    next();
});

//首页
router.get('/',function(req,res,next){
    //渲染后台首页
    res.render('admin/index',{
        userInfo:req.userInfo,
    });
})

//用户管理 User
router.get('/user',function(req,res,next){
    //从数据库中读取所有的用户数据
    //limit(Number):限制数据库获取条数
    //skip(Number):忽略数据的条数
    /*
      每页显示2条
      第一页：1-2条 =>skip(0) -> (当前页-1)*Number
      第二页：3-4条 =>skip(2)
    */
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    //获取数据库中用户条数
    User.count().then(function(count){
        
        //计算总页数,向上取整
        pages = Math.ceil(count/limit);
        //取值不能超过pages，如果page小于pages，取page，如果大于pages，取pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);

        var skip = (page-1)*limit;

        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                userInfo:req.userInfo,
                users:users,
                page:page,
                count:count,
                pages:pages,
                limit:limit
            });
        })

    })
  
})

//分类管理 Category
//分类首页 /category
router.get('/category',function(req,res,next){
    //从数据库中读取所有的用户数据
    //limit(Number):限制数据库获取条数
    //skip(Number):忽略数据的条数
    /*
      每页显示2条
      第一页：1-2条 =>skip(0) -> (当前页-1)*Number
      第二页：3-4条 =>skip(2)
    */
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    //获取数据库中分类条数
    Category.count().then(function(count){
        
        //计算总页数,向上取整
        pages = Math.ceil(count/limit);
        //取值不能超过pages，如果page小于pages，取page，如果大于pages，取pages
        page = Math.min(page,pages);
        //取值不能小于1
        page = Math.max(page,1);

        var skip = (page-1)*limit;

        Category.find().limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                userInfo:req.userInfo,
                categories:categories,
                page:page,
                count:count,
                pages:pages,
                limit:limit
            });
        })
    })
})

//分类添加-get /category/add
router.get('/category/add',function(req,res,next){
    res.render('admin/category_add',{
        userInfo:req.userInfo,
    })
})

//分类存储-post /category/add
router.post('/category/add',function(req,res,next){
    //body-parser处理post提交过来的数据
    var name = req.body.name || '' ;

    //如果分类名称为空
    if(name == ''){
         res.render('admin/error',{
             userInfo:req.userInfo,
             message:'Name cannot be empty',
             url:''
         })
    }

    //查询数据库，是否存在相同分类名称
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            //如果rs存在，则表示数据库中已经存在该分类
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'The name already exist!'
            })
            //
            return Promise.reject('The name already exist!');
        }else{
            //数据库中不存在该分类，可以保存
            return new Category({
                name:name
            }).save();
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'Save successfully!',
            url:'/admin/category'
        })
    }).catch((err)=>{
        console.log(err)
    })
    
})

//分类修改-get /category/edit
router.get('/category/edit',function(req,res,next){
    //获取要修改的分类信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function(category){
        
        //如果不存在，则表示没有分类信息
        if( !category ){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'The category don\'t  exist!'
            })
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            })
        }
    })
})

//分类修改保存-post /category/edit
router.post('/category/edit',function(req,res,next){
    //获取要修改的分类信息的id
    var id = req.query.id || '';
    //获取post提交过来的分类信息的名称
    var name = req.body.name;

    //获取要修改的分类名称
    Category.findOne({
        _id:id
    }).then(function(category){
        //如果不存在，则表示没有分类信息
        if( !category ){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'The category don\'t  exist!'
            })
            return Promise.reject();
        }else{
            //当用户没有做任何修改提交的时候
            if(name == category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'Edit Successfully!',
                    url:'/admin/category'
                })
                return Promise.reject();
            }else{
                //如果要修改的名称和原名称不一样，则要判断修改分类名称是否已经在数据库中存在，返回查找到的数据
                return Category.findOne({
                    //id不是一样的id
                    _id:{$ne:id},
                    name:name
                });
            }    
        }
    }).then(function(sameCategory){
        //如果数据库中存在
        if( sameCategory ){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'The Name already exist!'
            })
            return Promise.reject();
        }else{
            //如果数据库中不存在
            return Category.update({
                _id:id
            },{
                name:name
            }).then(function(){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'Edit Successfully!',
                    url:'/admin/category'
                })
            })
        }
    })

})

//分类删除 /category/delete
router.get('/category/delete',function(req,res,next){
    //获取要修改的分类信息的id
    var id = req.query.id || '';
    //获取？后面传送的确认或取消；
    var confirm = req.query.confirm || '';

    Category.findOne({
        _id:id
    }).then(function(category){
        if( confirm ){  
            Category.remove({
                _id:id
            }).then(function(result){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'Delete Successfully！',
                    url:'/admin/category'
                })
            })
        }else{
            res.render('admin/category_delete',{
                userInfo:req.userInfo,
                category:category
            });
        }
    })  
})

//内容管理 Content
//内容首页 /content
router.get('/content',function(req,res,next){
    var type = req.query.type ||'';
    var initTime = '';
    //分页
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    var categories = [];


    // console.log(type);


    if( type ){
        //获取数据库的分类信息
        Category.find().then(function(category){
            categories = category;
            // console.log(category);            
            // console.log(type);
            //返回获取数据库中内容条数
            return Content.count({
                category:type,
            })

        }).then(function(count){
            // console.log(count);
            
            //计算总页数,向上取整
            pages = Math.ceil(count/limit);
            //取值不能超过pages，如果page小于pages，取page，如果大于pages，取pages
            page = Math.min(page,pages);
            //取值不能小于1
            page = Math.max(page,1);

            var skip = (page-1)*limit;

            //populate('category')对应的是contents.js模型里category字段
            Content.find({
                category:type,
            }).sort({'addTime':-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
                // console.log(contents);
                res.render('admin/content_index',{
                    userInfo:req.userInfo,
                    contents:contents,
                    categories:categories,
                    page:page,
                    count:count,
                    pages:pages,
                    limit:limit,
                    type:type
                });
            })
        })
    }else{
        //获取数据库的分类信息
        Category.find().then(function(category){
            categories = category;
            //返回获取数据库中内容条数
            return Content.count()

        }).then(function(count){
            // console.log(count);
            
            //计算总页数,向上取整
            pages = Math.ceil(count/limit);
            //取值不能超过pages，如果page小于pages，取page，如果大于pages，取pages
            page = Math.min(page,pages);
            //取值不能小于1
            page = Math.max(page,1);

            var skip = (page-1)*limit;

            //populate('category')对应的是contents.js模型里category字段
            Content.find().sort({'addTime':-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
                // console.log(contents[0]);
                /* 
                    category: { _id: 595358fc3891b9c307cfa4f0, name: 'Home', __v: 0 },
                    user: 
                        { _id: 5950763f7e71ea0c86b7d4ef,
                        username: 'Vin',
                        password: 'tww110',
                        isAdmin: true },
                */
                res.render('admin/content_index',{
                    userInfo:req.userInfo,
                    contents:contents,
                    categories:categories,
                    page:page,
                    count:count,
                    pages:pages,
                    limit:limit,
                    type:type
                });
            })
        })
    }
 
})

//内容添加-get /content/add
router.get('/content/add',function(req,res,next){

    //读取数据库分类信息
    Category.find().then(function(categories){       
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories,
        })
    })
})

//内容保存-post /content/add
router.post('/content/add',function(req,res,next){
    // console.log(req.body);
    //分类不能为空
    if(req.body.category == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'Category cannot be empty!'
        })
    }
    //标题不能为空
    if(req.body.title == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'Title cannot be empty!'
        });
        return;
    }
    console.log(typeof req.body.category)
    //保存到数据库
    new Content({
        category:req.body.category,
        title:req.body.title,
        user:req.userInfo._id,
        description:req.body.description,
        content:req.body.content,
    }).save().then(function(rs){
        console.log(rs)
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'Save successfully',
            url:'/admin/content',
        })
    })
})

//修改内容-get /content/edit
router.get('/content/edit',function(req,res,next){
    var id = req.query.id;

    //用category数据库查找，将查找的名称赋值给categories
    var categories = [];

    Category.find().then(function(rs){

        categories = rs;

        return Content.findOne({
            _id:id,
        }).populate('category')
        
    }).then(function(content){
        // console.log(content);
        if( !content ){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'The content don\'s exist!'
            })
        }else{
            res.render('admin/content_edit',{
                userInfo:req.userInfo,
                content:content,
                categories:categories,
            })
        }
    })   
})

//保存修改的内容-post /content/edit
router.post('/content/edit',function(req,res,next){

    var id = req.query.id;

    Content.find({
        _id:id,
    }).then(function(content){
        // console.log(content[0].category)
        if( !content ){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'The content don\'t exist!'
            });
            return;
        }

        //分类不能为空
        if(req.body.category == ''){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'Category cannot be empty!'
            });
            return;
        }
        //标题不能为空
        if(req.body.title == ''){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'Title cannot be empty!'
            });
            return;
        }
        
        // 设置修改时间
        content[0].modification = new Date();
        content[0].save();
        // console.log(content[0].modification)

        Content.update({
            _id:id,
        },{
            category:req.body.category,
            title:req.body.title,
            description:req.body.description,
            content:req.body.content
        }).then(function(){
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'Save successfully!',
                url:'/admin/content'
            })
        })

    })

    
})

//删除内容 /content/delete
router.get('/content/delete',function(req,res,next){
    var id = req.query.id;
    var confirm = req.query.confirm || '';

    //进入该路由，如果问好符后confirm有值（有值代表是从选择yes或no时进入/content/delete，则渲染删除成功页面），如果问号符后confirm没有值(代表是从content的链接处点进来)，则渲染content_delete页面

    Content.findOne({
        _id:id,
    }).then(function(content){

        if( confirm ){
            Content.remove({
                _id:id
            }).then(function(){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'Delete successfully!',
                    url:'/admin/content',
                })
            })
        }else{
            res.render('admin/content_delete',{
                userInfo:req.userInfo,
                content:content,
            })
        }
    })

    

    
})

//内容评论 /content/comment
router.get('/content/comment',function(req,res,next){
    
    //分页的链接分类
    var sort = 'content';
    // 分页
    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;
    var skip = 0;

    Comment.count().then((count) => {

        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        skip = (page-1)*limit

        Comment.find().sort({'addTime':'-1'}).limit(limit).skip(skip).populate(['user','content']).then((comments) => {
            // console.log(comments)
            res.render('admin/comment',{
                userInfo: req.userInfo,
                comments:comments,
                sort: sort,
                limit: limit,
                page: page,
                pages: pages,
                count: count
            })
        })
    })




})

//内容评论编辑 /content/comment/edit
router.get('/content/comment/edit',function(req,res,next){
    let sort = 'content';
    let id = req.query.id;

        Comment.find({
            _id: id
        }).then((comment) => {
            console.log(comment)
            res.render('admin/comment_edit',{
                userInfo: req.userInfo,
                comment:comment[0],
                sort: sort
            })
        })
})

//内容评论删除 /content/comment/delete


//


//项目管理 Project
//项目列表 /project
router.get('/project',function(req,res,next){
    res.render('admin/project_index',{
        userInfo: req.userInfo
    })
})

//项目添加 /project/add
router.get('/project/add',function(req,res,nect){
    res.render('admin/project_add',{
        userInfo: req.userInfo
    })
})

router.post('/project/add',function(req,res,next){
    // res.render('')
})




module.exports = router;