//首页  /
//博客 /blog 
//博客文章 /blog/article
//项目展示 /show
//其他信息 /about


var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');
var Comment = require('../models/Comment');

//首页 Home
router.get('/',function(req,res,next){
    var data = {
        userInfo:req.userInfo,
        categories:[],
        page : Number(req.query.page || 1),
        limit : 10,
        pages : 0,
        count:0,
    }

    //读取所有的分类信息
    Category.find().then(function(categories){
        
        data.categories = categories;

        return Content.count();
        
    }).then(function(count){
        
        data.count = count;
        //计算总页数,向上取整
        data.pages = Math.ceil(data.count/data.limit);
        //取值不能超过pages，如果page小于pages，取page，如果大于pages，取pages
        data.page = Math.min(data.page,data.pages);
        //取值不能小于1
        data.page = Math.max(data.page,1);

        var skip = (data.page-1)*data.limit;

        return Content.find().limit(data.limit).skip(skip).populate(['category','user']);

    }).then(function(contents){
        
        data.contents = contents;
        res.render('main/index.html',data);
        console.log(contents);
    })
    
})

//Blog
router.get('/blog',function(req,res,next){

    var categoryid = req.query.categoryid || 0;
    var categories = null;

    console.log(categoryid); 

    // page
    // limit(Number):限制数据库获取条数
    // skip(Number):忽略数据的条数
    var page = req.query.page || 1;
    var pages = 0;
    var limit = 5;
    var skip = 0;


    if(categoryid){

        Category.find().then(function(category){
            categories = category;

            return Content.count({

                category: categoryid
                // name: changeQueryCate
            
            })

        }).then(function(count){
            // console.log(count)
            // 计算总页数,向上取整
            pages = Math.ceil(count/limit);

            //取值不能超过pages，如果page小于pages，取page，如果大于pages，取pages
            page = Math.min(page,pages);
            //取值不能小于1
            page = Math.max(page,1);

            skip = (page-1)*limit;

            Content.find({
                category: categoryid
            }).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
                // console.log(contents);
                res.render('main/blog_index',{
                    userInfo:req.userInfo,
                    categories:categories,
                    categoryid: categoryid,
                    contents:contents,
                    count:count,
                    page: page,
                    pages:pages,
                    limit: limit
                })
            })
        })

    }else{
                       
        Category.find().then(function(category){
            categories = category;
            return Content.count()
        }).then(function(count){
            console.log('1')
            // 计算总页数,向上取整
            pages = Math.ceil(count/limit);

            //取值不能超过pages，如果page小于pages，取page，如果大于pages，取pages
            page = Math.min(page,pages);
            //取值不能小于1
            page = Math.max(page,1);

            skip = (page-1)*limit;

            Content.find().limit(limit).skip(skip).populate(['category','user']).then(function(contents){
                // console.log(contents);
                res.render('main/blog_index',{
                    userInfo:req.userInfo,
                    categories:categories,
                    categoryid: categoryid,
                    contents:contents,
                    count:count,
                    page: page,
                    pages:pages,
                    limit: limit
                })
            })
        })
    }
 
})

//Blog article
router.get('/blog/article',function(req,res,next){
    var contentid = req.query.id || '';
    var articleContent = '';

    // 分页
    var page = req.query.page || 1;
    var limit = 5;
    var skip = '';
    var counts = '';
    var pages = '';

    Content.find({
        _id: contentid
    }).then(function(content){
        content[0].views++;  
        content[0].save();
        articleContent = content;
        
        return Comment.count()

    }).then(function(counts){

        count = counts;
        pages = Math.ceil(count/limit);
        page = Math.max(page,1);
        page = Math.min(page,pages);
        skip = (page-1)*limit;

        Comment.find().sort({'addTime':-1}).limit(limit).skip(skip).then(function(comments){
            res.render('main/blog_article',{
                userInfo: req.userInfo,
                contents: articleContent,
                comments: comments,
                contentid: contentid,
                page: page,
                count: count,
                pages: pages,
                limit: limit
            })
        })
    })
    
})

//Show
router.get('/show',function(req,res,next){

    //读取所有的分类信息
    Category.find().then(function(categories){
             
        res.render('main/show_index.html',{
            userInfo:req.userInfo,
            categories:categories  
        });               

    })
})

//About
router.get('/about',function(req,res,next){
    Category.find().then(function(categories){
             
        res.render('main/about_index.html',{
            userInfo:req.userInfo,
            categories:categories  
        });               

    })
})


module.exports = router;