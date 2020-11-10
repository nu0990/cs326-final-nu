'use strict';

const baseURL='http://localhost:8080'

function reg(name,email,pw){
    const data = { 
      'name':name,
      'email':email,
      'pw':pw
    };

    fetch(baseURL+'/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .catch((error) => {
        console.error('Error:', error);
      });
}

function User(){
    const name=document.getElementById("username").value
    const email=document.getElementById('email').value
    const pw=document.getElementById('password').value
    const pw2=document.getElementById('passwordRepeat').value
    if(name===''){
        alert('user name can not be empty')
    }else if(email===''){
        alert('email can not be empty')
    }else if(pw===''){
        alert('password can not be empty')
    }else if(pw2===''){
        alert('please repeat password')
    }else if(pw!==pw2){
        alert('different passwords')
    }else{
        const res=reg(name,email,pw)
    }
    //
}

document.getElementById('submit').addEventListener('click',()=>{
    User()
})