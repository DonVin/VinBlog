
var html = document.documentElement;
html.fontSize = html.clientWidth/144+'px';
$(window).resize(function(){
    var html = document.documentElement;
    html.fontSize = html.clientWidth/144 + 'px';
})
document.addEventListener('touchstart',function(ev){
    ev.preventDefault();
})