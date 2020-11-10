'use strict';
//import {baseURL,uid} from './constant.js';

export async function node_post(uid,info,name,description){
    const data = { 
      'uid':uid,
      'info':info,
      'name':name,
      'description':description
    };
    const res=await fetch(baseURL+'/user/nodes', {
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
       const id=res.JSON.stringify()
       return id
    }else{
        console.error('Error');}
    
}

export async function comment_post(uid,node_id,comment){
    const data = { 
      'uid':uid,
      'nid':node_id,
      'comment':comment
    };
    const res=await fetch(baseURL+`/node/${node_id}/comments`, {
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
       const comment_id=res.JSON.stringify()
       return comment_id
    }else{
        console.error('Error');
    }
    
}

export function fav_post(uid,node_id){
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
