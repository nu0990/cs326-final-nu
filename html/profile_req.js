'use strict';
const baseURL= 'http://localhost:8080' || 'https://freelink-326.herokuapp.com'

async function deletecomment(comment_id) {
    
    const res=await fetch((baseURL+`/user/comments/${comment_id}`), {
      method: 'DELETE'
    })
}

async function Update_password() {
    const pw=document.getElementById('newpassword').value
    const res=await fetch((baseURL+`/user/update/password`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'password':pw})
    })
}

async function Update_email() {
    const email=document.getElementById('newemail').value
    const res=await fetch((baseURL+`/user/update/email`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'email':email})
    })
}

function add_comment_listener(){
    for (let i = 0; i < comment_b.length; i++) {
        comment_b[i].addEventListener("click", () =>{ 
            const n=window.event.target.id;
            const cid=n[n.length-1]
            const comment=document.getElementById(`co_${cid}`)
            comment.innerHTML=''
            //send delete req to server
            deletecomment(cid)
        })
    } 
}
const comment_b=document.getElementsByClassName("btn btn-outline-primary delete_comment")
add_comment_listener()

document.getElementById("change_email").addEventListener("click",Update_email);
document.getElementById("changepw").addEventListener("click",Update_password);