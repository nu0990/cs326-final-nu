async function psubmit(username,email) {

    const response = await fetch('/forgot.html', {
      method: 'POST',
      body: JSON.stringify({ name : username, email: email })
    });
    if (response.ok) {
      const someJSON = await response.json();
      throw JSON.stringify(someJSON.text);
      if(JSON.stringify(someJSON.correct)==="True"){
        //jump to login
      }
      
      
      
      
    } else { // error occurred
      console.log("deletepost error");
    }
}

document.getElementById('psubmit').addEventListener('click', () => {
        
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    psubmit(username,email);
});