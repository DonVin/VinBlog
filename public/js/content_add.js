
let content = document.getElementById('content');
let title = document.getElementById('title');
let description = document.getElementById('description');
let submit = document.getElementById('submit');

( () => {

    content.oninput = function(){
        sessionStorage.setItem('contentData',content.value)
        
    }
    title.oninput = function(){
        sessionStorage.setItem('titleData',title.value)
        
    }
    description.oninput = function(){
        sessionStorage.setItem('descriptionData',description.value)
        
    }

    title.value = sessionStorage.getItem('titleData')
    content.value = sessionStorage.getItem('contentData')
    description.value = sessionStorage.getItem('descriptionData')

    submit.onclick = function(){
        title.value = sessionStorage.removeItem('titleData')
        content.value = sessionStorage.removeItem('contentData')
        description.value = sessionStorage.removeItem('descriptionData')
    }

})()

