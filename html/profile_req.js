'use strict'
const baseURL = 'https://freelink-326.herokuapp.com'

async function deletecomment (comment_id) {
  const res = await fetch((baseURL + `/user/comments/${comment_id}`), {
    method: 'DELETE'
  })
}

async function deletePost (node_id) {
  const res = await fetch((baseURL + `/user/nodes/${node_id}`), {
    method: 'DELETE'
  })
}

async function Update_password () {
  const pw = document.getElementById('newpassword').value
  const res = await fetch((baseURL + '/user/update/password'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password: pw })
  })
}

async function Update_email () {
  const email = document.getElementById('newemail').value
  const res = await fetch((baseURL + '/user/update/email'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email })
  })
}

function add_comment_listener (comment_b) {
  for (let i = 0; i < comment_b.length; i++) {
    comment_b[i].addEventListener('click', () => {
      const n = window.event.target.id
      const cid = n
      const comment = document.getElementById(`co_${cid}`)
      comment.innerHTML = ''
      // send delete req to server
      deletecomment(cid)
      deletePost(cid)
    })
  }
}

// const comment_b=document.getElementsByClassName("btn btn-outline-primary delete_comment")
// add_comment_listener()

document.getElementById('change_email').addEventListener('click', Update_email)
document.getElementById('changepw').addEventListener('click', Update_password)

window.addEventListener('load', async function () {
  const responseemail = await fetch(baseURL + '/user/email')
  const responsename = await fetch(baseURL + '/user/name')
  if (responseemail.ok) {
    const res = await responseemail.json()
    const emailHash = CryptoJS.MD5(responseemail)
    document.getElementById('user-avatar').src = 'https://www.gravatar.com/avatar/' + emailHash.toString()
    document.getElementById('useremail').innerHTML = res[0].email
  } else {
    console.error('email Error')
  }

  if (responsename.ok) {
    document.getElementById('username').innerHTML = await responsename.text()
  } else {
    console.error('name Error')
  }
  const responsenode = await fetch(baseURL + '/user/nodes')
  if (responsenode.ok) {
    const somenode = await responsenode.json()
    const thediv = document.getElementById('POSTED')
    for (let i = 0; i < somenode.length; i++) {
      const newDiv = document.createElement('div')
      const nid = somenode[i].node_id
      newDiv.className = 'input-group'
      newDiv.id = 'co_' + nid
      const content = '"' + somenode[i].description + somenode[i].name + '"'
      console.log(content)
      newDiv.innerHTML = `<input type="text" class="form-control" value=${content} id="numcomment">`
      const button = document.createElement('div')
      button.className = 'input-group-append'
      button.innerHTML = `<button class="btn btn-outline-primary" type="button" id="${nid}">Delete</button>`
      newDiv.appendChild(button)
      thediv.appendChild(newDiv)
    }
  } else {
    console.error('node Error')
  }

  const res_c = await fetch(baseURL + '/user/comment')
  if (responsenode.ok) {
    const comment = await res_c.json()
    const thediv = document.getElementById('COMMENT')
    for (let i = 0; i < comment.length; i++) {
      const newDiv = document.createElement('div')
      const cid = comment[i].comment_id
      const content = '"' + comment[i].text + '"'
      newDiv.className = 'input-group'
      newDiv.id = 'co_' + cid
      console.log(content)
      newDiv.innerHTML = ` <input type="text" class="form-control" placeholder=${content}/>`
      const button = document.createElement('div')
      button.className = 'input-group-append'
      button.innerHTML = `<button class="btn btn-outline-primary" type="button" id=${cid}>Delete</button>`
      newDiv.appendChild(button)
      thediv.appendChild(newDiv)
    }
  } else {
    console.error('node Error')
  }
  const delb = document.getElementsByClassName('btn btn-outline-primary')
  add_comment_listener(delb)
})
