

//clearBox
let clearBox = {
    Rtext(){
        $('.registerBox').find('[name="username"]').val('');
        $('.registerBox').find('[name="password"]').val('');
        $('.registerBox').find('[name="confirm"]').val('');
    },
    Rhint(){
        $('.registerBox').find('.hintSucc').html('');
        $('.registerBox').find('.hintFail').html('');
    },
    Ltext(){
        $('.loginBox').find('[name="username"]').val('');
        $('.loginBox').find('[name="password"]').val('');
    },
    Lhint(){
        $('.loginBox').find('.hintSucc').html('');
        $('.loginBox').find('.hintFail').html('');
    }
};

//User loginBox show or hide
(function(){
    // 个人中心登录
    $('.glyphicon-user').on('click.show',function(){
        //判断用户是否处于登陆状态
        if($('.loginName').html()){
            return;
        }
        $('.loginBox').show();
        $('.loginBox').find('[name="username"]').focus();
    });
    // 评论处点击登录
    $('.commentLogin').on('click',function(){
        $('.loginBox').show();
        $('.loginBox').find('[name="username"]').focus();
    });

    $('.loginClose').on('click',function(){
         $('.loginBox').hide();
         $('.registerBox').hide();
         clearBox.Rtext();
         clearBox.Rhint();       
         clearBox.Ltext();
         clearBox.Lhint();    
    });
    $('.btnTabRegister').on('click',function(){
        $('.loginBox').hide();
        $('.registerBox').show();
        $('.registerBox').find('[name="username"]').focus();
    });
    $('.btnTabLogin').on('click',function(){
        $('.registerBox').hide();
        $('.loginBox').show();
        $('.loginBox').find('[name="username"]').focus();
    });
}());


//Users Register
(function(){
    
    $('.btnSucRegister').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$('.registerBox').find('[name="username"]').val(),
                password:$('.registerBox').find('[name="password"]').val(),
                confirm:$('.registerBox').find('[name="confirm"]').val(),
            },
            dataType:'json',
            success:function(result){
                console.log(result);
                //接收的rusult是res.json()中返回的responseData
                if( result.code ){
                    $('.registerBox').find('.hintSucc').html('');
                    $('.registerBox').find('.hintFail').html(result.message);
                }
                if( !result.code ){
                    $('.registerBox').find('.hintFail').html('');
                    $('.registerBox').find('.hintSucc').html(result.message);
                    setTimeout(function(){
                        $('.registerBox').hide();  
                        clearBox.Ltext();
                        clearBox.Lhint(); 
                        $('.glyphicon-user').unbind();
                        window.location.reload();                
                    },500);  
                }
            }
        })
    });    
}());

//Users Login
(function(){
    $('.btnSucLogin').on('click',function(){
        //通过ajax提交请求
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$('.loginBox').find('[name="username"]').val(),
                password:$('.loginBox').find('[name="password"]').val(),
            },
            dataType:'json',
            success:function(result){
                // console.log(result);
                //接收的rusult是res.json()中返回的responseData
                //登陆失败
                if( result.code ){
                    $('.loginBox').find('.hintSucc').html('');
                    $('.loginBox').find('.hintFail').html(result.message);
                }
                //登陆成功
                if( !result.code ){
                    $('.loginBox').find('.hintFail').html('');
                    $('.loginBox').find('.hintSucc').html(result.message);
                    setTimeout(function(){
                        $('.loginBox').hide();    
                        clearBox.Ltext();
                        clearBox.Lhint(); 
                        $('.glyphicon-user').unbind();
                        window.location.reload();
                    },500);  
                }
                
            }
        })
    })
}());


//Users outLogin
(function(){
    $('.outLogin').on('click',function(){
        //ajax交互
        $.ajax({
            type:'get',
            url:'/api/user/logout',
            dataType:'json',
            success:function(result){
                //成功退出
                if( !result.code ){
                    //点击quit，添加登陆弹窗事件
                    $('.loginName').html('');
                    $('.outLogin').html('');
                    $('.glyphicon-user').on('click.show',function(){
                        $('.loginBox').show();
                    });
                    //刷新页面，清除cookie
                    window.location.reload();
                }
                
            }
        })
    })
}());



