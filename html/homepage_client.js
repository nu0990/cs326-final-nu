'use strict';

const baseURL= 'http://localhost:8080' || 'https://freelink-326.herokuapp.com'

export async function node_post(info,name,description){
    const in2=JSON.stringify(info)
    const data = { 
      'info':in2,
      'name':name,
      'description':description
    };
    const res=await fetch(baseURL+'/nodes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if(res.ok){
       const id=res.text()
       return id
    }else{
        console.error('Error');}
    
}

export async function comment_post(node_id,comment,date){
    const data = { 
      'nid':node_id,
      'comment':comment,
      'date':date
    };
    const res=await fetch(baseURL+`/node/comments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    if(res.ok){
       const comment_id=res.text()
       return comment_id
    }else{
        console.error('Error');
    }
    
}

export async function fav_post(uid,node_id){
    const data = { 
        'uid':uid,
        'node_id':node_id
      };
  
      fetch(baseURL+'/user/favorite', {
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

