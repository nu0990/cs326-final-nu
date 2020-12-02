'use strict';
import * as req from './homepage_client.js'

let baseURL= 'https://freelink-326.herokuapp.com'

function render_post(id,name,description,info){
    const container=document.getElementById("posted_node");
    
    const child=document.createElement('div');
    child.className=`card${id}`
    child.id=id;
    const header=document.createElement('div');
    header.className='card-header'
    const text=document.createElement('div')
    text.className="card-text"
    const button_group=document.createElement('div')
    button_group.className="button group"
    const comment=document.createElement('div')
    comment.className="input-group mb-3"
    const collapse=document.createElement('div')
    collapse.className="collapse"
    collapse.id=`collapse${id}`
   
    header.innerHTML='<h5>'+name+'</h5>'+'<h6 class="text-muted">'+info+'</h6>'
    text.innerHTML='<p>'+description+'</p>'
    button_group.innerHTML=
    `<button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse${id}" aria-expanded="false" aria-controls="collapse${id}">show comment </button>`
    
    comment.innerHTML=
    `<input type="text" class="form-control" placeholder="user comment" id="user_comment${id}"></input>`
    +`<button type="button"  class="comment_button" id="comment${id}">comment</button>`

    child.appendChild(header)
    child.appendChild(text)
    child.appendChild(button_group)
    child.appendChild(comment)
    child.appendChild(collapse)

    container.appendChild(child);
}

function render_commment(id,comment,comment_id,date){
    
    const parent=document.getElementById(`collapse${id}`)
    const child0=document.createElement('div')
    const child=document.createElement('div')
    const text=document.createElement('textarea')
    child0.className='input-group'

    child.className="input-group-prepend"
    child.innerHTML=`<span class="input-group-text">${date}</span>`

    text.className="form-control"
    //todo
    text.label='COMMENTID'
    text.innerHTML=comment

    child0.appendChild(child)
    child0.appendChild(text)
    parent.appendChild(child0)
    
}

function add_comment_listener(){
    for (let i = 0; i < comment_b.length; i++) {
        comment_b[i].addEventListener("click", () =>{ 
            const n=event.target.id;
            const node_id=n.slice(7)
            const comment=document.getElementById(`user_comment${node_id}`).value
            const date=new Date().toLocaleDateString()
            //wait for comment id 
            const comment_id=req.comment_post(node_id,comment,date)
            render_commment(node_id,comment,comment_id,date);
        })
    } 
}

window.addEventListener("load", async function() {
    const response=await fetch(baseURL+'/node/all');
    if(response.ok){
        const r =await response.json()
        console.log(r)
        r.forEach( async function(element) {
            const id=element['node_id']
            const name=element['name']
            const description=element['description']
            const info=element['info']
            render_post(id,name,description,info)
            const res2=await fetch(baseURL+`/node/comment/${id}`);
            const res3=await res2.json()
            console.log(res3)
            res3.forEach(ele=>{
                const comment_id=ele['comment_id']
                const comment=ele['text']
                const date=ele['create_date']
                render_commment(id,comment,comment_id,date)
            }) 
        });
       }else{
        console.error('Error');
       }
       add_comment_listener()
})

//post button
document.getElementById("post_button").addEventListener('click',async()=>{ 
    const name=document.getElementById("post_name").value;
    const description=document.getElementById("post_url").value;
    const info=document.getElementById("post_info").value;
    //wait for node_id
    const node_id=req.node_post(info,name,description)
    //render post to html
    render_post(node_id,name,description,info)
    add_comment_listener()
    add_fav_listener()
});

//comment
const comment_b=document.getElementsByClassName("comment_button")
add_comment_listener()

//fav
const fav_b=document.getElementsByClassName('fav_button')
add_fav_listener()