async function submit(username,password,check) {

    const response = await fetch('/login.html', {
      method: 'POST',
      body: JSON.stringify({ name : username, password:password, check: check })
    });
    if (response.ok) {
      const someJSON = await response.json();
      if(JSON.stringify(someJSON.token)==="True"){
        //jump to homepage
      }
      else{
        throw JSON.stringify(someJSON.text);
      }
      document.reload();
    } else { // error occurred
      console.log("deletepost error");
    }
}

document.getElementById('submit').addEventListener('click', () => {
        
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const check = document.getElementById('rememberMe').value;
    submit(username,password,check);
});
