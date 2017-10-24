// get blog article
// post comment


// get blog article
(function(){

    let articleContent = $('.articleContent');
    let id = window.location.search.slice(1).split('=')[1];

    $.ajax({
        url: '/api/user/article',
        data:{
            id: id
        },
        type: 'post',
        dataType: 'json',
        success (result) {
            // console.log(result.article)
            articleContent.html( result.article.content );
        }
    })

})();

// post comment
// post article comment
(()=>{
    let submit = $('.commentSubmit');
    let articleId = window.location.search.slice(1).split('=')[1];   
    // 获取ip
    let ip = returnCitySN['cip'];
    let address = returnCitySN['cname'];
    // 获取commentList DOM
    let author = $('.commentAuthor_who');
    let time = $('.commentTime_now');

    submit.on('click',()=>{
        let commentVal = $('.inputComment textarea').val();
        if( commentVal.length < 5 ) {
            alert('Must be greater than 5 characters！')
            return false;
        }
        
        $.ajax({
            url: '/api/article/comment',
            data: {
                articleId: articleId,
                commentVal: commentVal,
                ip: ip,
                address: address
            },
            dataType: 'json',
            type: 'post',
            success () {
                console.log(1)
                location.reload();
            }
        })
    })
    
    
})()

// post project comment

