
async function changepass(npw) {

    const response = await fetch('/user/:userId', {
      method: 'PUT',
      body: JSON.stringify({  user_id: uid,password : npw })
    });
    if (response.ok) {
      const someJSON = await response.json();
      throw JSON.stringify(someJSON);
      document.reload();
    } else { // error occurred
      console.log("changepassword error");
    }
}
async function changeemail(nem) {

    const response = await fetch('/user/:userId', {
      method: 'POST',
      body: JSON.stringify({ user_id: uid, email : nem })
    });
    if (response.ok) {
      const someJSON = await response.json();
      throw JSON.stringify(someJSON);
      document.reload();
    } else { // error occurred
      console.log("changeemail error");
    }
}
async function deletecollect(numcol) {

    const response = await fetch('/user/favorite', {
      method: 'DELETE',
      body: JSON.stringify({ user_id: uid, node_id : numcol })
    });
    if (response.ok) {
      const someJSON = await response.json();
      throw JSON.stringify(someJSON);
      document.reload();
    } else { // error occurred
      console.log("deletecollect error");
    }
}
async function deletepost(numpost) {

    const response = await fetch('/profile.html/deletepost', {
      method: 'DELETE',
      body: JSON.stringify({ postid : numpost })
    });
    if (response.ok) {
      const someJSON = await response.json();
      throw JSON.stringify(someJSON);
      document.reload();
    } else { // error occurred
      console.log("deletepost error");
    }
}
async function deletecomment(numcomment) {

    const response = await fetch(('/user/comments/').concat(JSON.stringify(numcomment)), {
      method: 'DELETE',
      
    });
    if (response.ok) {
      const someJSON = await response.json();
      throw JSON.stringify(someJSON);
      document.reload();
    } else { // error occurred
      console.log("deletepost error");
    }
}
window.addEventListener("load", async function() {
    const response = await fetch('/uid/profile.html', {
      method: 'GET',
      //body: JSON.stringify({ uid : JSON.parse(window.localStorage.getItem("uid")) })
    });
    if (response.ok) {
      
      const someJSON = await response.json();
      document.getElementById('username').innerHTML=JSON.stringify(someJSON.name);
      document.getElementById('useremail').innerHTML=JSON.stringify(someJSON.email);

      document.getElementById('changepw').addEventListener('click', () => {
        const currpw = document.getElementById('curr_pw').value;
        const newpw = document.getElementById('newpassword').value;

        changepass(newpw);
      });
      document.getElementById('changeem').addEventListener('click', () => {
        
        const newem = document.getElementById('newemail').value;

        changeemail(newem);
      });

      document.getElementById('deletecollect').addEventListener('click', () => {
        
        const numcollect = document.getElementById('numcollect').value;

        deletecollect(numcollect);
      });
      const collect=someJSON.collections;//you need to give array
      const thediv= document.getElementById("collections");
      for (let i=0; i<collect.length;i++){
        const newDiv = document.createElement("div");
        newDiv.innerHTML=JSON.stringify(collect[i]);

        thediv.appendChild(newDiv);
      }

      document.getElementById('deletepost').addEventListener('click', () => {
        
        const numpost = document.getElementById('numpost').value;

        deletepost(numpost);
      });
      const posts=someJSON.posts;//you need to give array
      const pdiv= document.getElementById("posts");
      for (let i=0; i<posts.length;i++){
        const newDiv = document.createElement("div");
        newDiv.innerHTML=JSON.stringify(posts[i]);

        pdiv.appendChild(newDiv);
      }
      document.getElementById('deletecomment').addEventListener('click', () => {
        
        const numcomment = document.getElementById('numcomment').value;

        deletecomment(numcomment);
      });
      const comments=someJSON.comments;//you need to give array
      const comdiv= document.getElementById("comments");
      for (let i=0; i<comments.length;i++){
        const newDiv = document.createElement("div");
        newDiv.innerHTML=JSON.stringify(posts[i]);

        comdiv.appendChild(newDiv);
      }

    } else { // error occurred
      
      throw "an error has occurred.";
    }
});