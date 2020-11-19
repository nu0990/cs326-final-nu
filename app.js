const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
// const indexRouter = require('./routes/index')
// const usersRouter = require('./routes/users')
// const apiRouter = require('./routes/api')
// app.use('/', indexRouter)
// app.use('/users', usersRouter)
// app.use('/api', apiRouter)

const app = express()

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
if (!findUser(username)) {
    // no such user
    return done(null, false, { 'message' : 'Wrong username' });
}
if (!validatePassword(username, password)) {
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

// db Object for testing
console.log(mc.hash('compsci326'));
// let users = { 'emery' : 'compsci326' } // default user
let users = { 'emery' : [
  '2401f90940e037305f71ffa15275fb0d',
  '61236629f33285cbc73dc563cfc49e96a00396dc9e3a220d7cd5aad0fa2f3827d03d41d55cb2834042119e5f495fc3dc8ba3073429dd5a5a1430888e0d115250',
  'xxx@gmail'
] };
let userMap = {};

// Returns true iff the user exists.
function findUser(username) {
  if (!users[username]) {
       return false;
  } else {
       return true;
  }
}

// Returns true iff the password is the one we have stored (in plaintext = bad but easy).
function validatePassword(name, pwd) {
  if (!findUser(name)) {
       return false;
    }
    salt=users[name][0]
    hash=users[name][1]
    const res=mc.check(pwd,salt,hash);
    return res;
}

// Add a user to the "database".
function addUser(name, pwd,email) {
  if (!findUser(name)) {
    const [salt, hash] = mc.hash(pwd);
    users[name]=[salt, hash,email];
    return true;
  }else{
  return false;
   }
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
    res.send("hello world");
});

// Handle post data from the login.html form.
app.post('/login',
 passport.authenticate('local' , {     // use username/password authentication
     'successRedirect' : '/index.html',   // when we login, go to /private 
     'failureRedirect' : '/login'      // otherwise, back to login
 }));

// Handle the URL /login (just output the login.html file).
app.get('/login',
(req, res) => res.sendFile('html/login.html',
         { 'root' : __dirname }));

// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
  req.logout(); // Logs us out!
  res.redirect('/index.html'); 
});

// Like login, but add a new user and password IFF one doesn't exist already.
// If we successfully add a new user, go to /login, else, back to /register.
// Use req.body to access data (as in, req.body['username']).
// Use res.redirect to change URLs.
app.post('/register',
 (req, res) => {
     const username = req.body['name'];
     const password = req.body['password'];
     const email=req.body['email']
     if (addUser(username, password,email)) {
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

app.use(express.static('html'));


module.exports = app
