const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const db = require('./db_func')
const { v1: uuidv1 } = require('uuid');
const app = express()

const indexRouter = require('./routes/index')
//const usersRouter = require('./routes/users')
//app.use('/users', usersRouter)
app.use('/', indexRouter)
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({'extended' : true})); // allow URLencoded data

//auth
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
const minicrypt = require('./miniCrypt');
const mc = new minicrypt();

// Session configuration
const session = {
  secret : process.env.SECRET || 'SECRET', // set this encryption key in Heroku config (never in GitHub)!
  resave : false,
  saveUninitialized: false
};

// Passport configuration
const strategy = new LocalStrategy(
  async (username, password, done) => {
const r1=await findUser(username)
if (!r1) {
    // no such user
    return done(null, false, { 'message' : 'Wrong username' });
}
const r2=await validatePassword(username, password)
if (!r2) {
    // invalid password
    // should disable logins after N messages
    // delay return to rate-limit brute-force attacks
    await new Promise((r) => setTimeout(r, 2000)); // two second delay
    return done(null, false, { 'message' : 'Wrong password' });
}
// success!
// should create a user object here, associated with a unique identifier
return done(null, username);
  });

// App configuration
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

// Convert user object to a unique identifier.
passport.serializeUser((user, done) => {
    done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => {
    done(null, uid);
});

/////

// Returns true iff the user exists.
async function findUser(username) {
  const res=await db.findUser(username);
  if (res.length === 0) {
       return false;
  } else {
       return true;
  }
}

// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
async function validatePassword(name, pwd) {
  const res=await findUser(name)
  if (!res) {
       return false;
    }
    const row=await db.findUser(name)
    salt=row[0]['salt']
    hash=row[0]['password']
    //console.log(row[0])
    const res2=mc.check(pwd,salt,hash);
    return res2;
}

// Add a user to the "database".
async function addUser(name, pwd,email) {
  const re=await findUser(name)
  if (!re) {
     const [salt, hash] = mc.hash(pwd);
     db.insertUser(name,hash,email,salt);
     return true;
  }else{
     return false;
   }
}

async function updateHandler(req,res){
  const subject=req.params.subject
  const uid=req.user
  if(subject==='email'){
     const email=req.body['email']
     await db.Update_email(uid,email)
  }else{
     const pwd=req.body['password']
     const [salt, hash] = mc.hash(pwd);
     await db.Update_pw(uid,hash,salt)
  }
  res.end()
}

// Routes
function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
// If we are authenticated, run the next route.
next();
  } else {
// Otherwise, redirect to the login page.
res.redirect('/login');
  }
}

app.get('/',
checkLoggedIn,
(req, res) => {
    res.end();
});

// Handle post data from the login.html form.
app.post('/login',
 passport.authenticate('local' , {     // use username/password authentication
     'successRedirect' : '/private',   // when we login, go to /private 
     'failureRedirect' : '/login'      // otherwise, back to login
 }));

// Handle the URL /login (just output the login.html file).
app.get('/login',
(req, res) => res.sendFile('html/login.html',
         { 'root' : __dirname }));

// Handle logging out
app.get('/logout', (req, res) => {
  req.logout(); // Logs us out!
  res.redirect('/index.html'); 
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register',
 async function(req, res) {
     const username = req.body['name'];
     const password = req.body['password'];
     const email=req.body['email']
     const r=await addUser(username, password,email)
     if (r) {
            res.redirect('/login');
     } else {
            res.redirect('/register');
     }
 });

// Register URL
app.get('/register',
(req, res) => res.sendFile('html/register.html',
         { 'root' : __dirname }));

// Private data
app.get('/private',
checkLoggedIn, // If we are logged in (notice the comma!)...
(req, res) => {             // Go to the user's page.
    res.redirect('/private/' + req.user);
});

// A dummy page for the user.
app.get('/private/:userID/',
checkLoggedIn, // We also protect this route: authenticated...
(req, res) => {
    // Verify this is the right user.
    if (req.params.userID === req.user) {
  //res.writeHead(200, {"Content-Type" : "text/html"});
  //res.write('<H1>HELLO ' + req.params.userID + "</H1>");
  //res.write('<br/><a href="/logout">click here to logout</a>');
    res.redirect('/profile.html')
    res.end();
    } else {
    res.redirect('/private/');
    }
});

//delete a comment for a user
app.delete('/user/comments/:cid',checkLoggedIn,async function(req, res) {
   // Verify this is the right user.
   console.log(req.user)
   const uid=req.user
   const cid=req.params.cid
   //Delete a comment with this uid from db
   const r= await db.DEL_Comment(uid,cid)
   res.write('200')
});

// update credential
app.put('/user/update/:subject',updateHandler)

//delete a node from user's fav
app.delete('/user/favorite/nid:',checkLoggedIn,async function(req, res) {
  // Verify this is the right user.
  console.log(req.user)
  const uid=req.user
  //Delete a comment with this uid from db
  const r= await db.DEL_Comment(uid)
  res.write('200')
});

//delete a node from user's posts
//app.delete('/user/nodes/nid:',deleteHandler)

//get content for pofile_page
//app.get('/user/subject:',Get_Handler)


async function createNode(req, res) {
  const info = req.body['info'];
  const nodeName=req.body['name'];
  const des=req.body['description'];
  const uid=req.user;
  //gernerate a node_id
  const node_id=uuidv1();
  console.log(uid,node_id)
  //save node to database
  await db.addNode(uid,node_id,info,nodeName,des);
  //node[node_id]=[info,nodeName,des];
  res.send(node_id);
}

async function createComment(req, res) {
  const node_id=req.body['nid']
  const uid=req.user
  const date=req.body['date']
  const content=req.body['comment']
  //gernerate a node_id
  const c_id=uuidv1()
  //save comment to database
  const r=await db.addComment(c_id,node_id,uid,content,date);
  res.send(c_id);
}

app.post('/nodes/create',createNode)

app.post('/node/comments/create',createComment)

app.use(express.static('html'));

module.exports = app
