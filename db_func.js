'use strict'
const pgPromise = require('pg-promise')

const pgp = pgPromise({
    connect(client) {
    console.log('Connected to database:', client.connectionParameters.database);
  },disconnect(client) {
    console.log('Disconnected from database:', client.connectionParameters.database);
  }});
  
const username = "postgres";
const password = "admin";
const connection =process.env.DATABASE_URL || `postgres://${username}:${password}@localhost/`;
const db = pgp(connection);

async function connectAndRun(task) {
  let connection = null;
  try {
      connection = await db.connect();
      return await task(connection);
  } catch (e) {
      throw e;
  } 
}

// Returns a row from user_table or empty if user does not exist
async function findUser(username) {
  return await db.any("SELECT * FROM user_table WHERE name=$1;",username);
}

// Add a user to the "database"
async function insertUser(name, pwd,email,salt) {
   return await db.none("INSERT INTO user_table VALUES ($1,$2,$3,$4);",[name,pwd,email,salt]);
}

//Save Node to db
async function SaveNode() {
  
}

//Save comment to db
async function SaveComment() {
   
}

//get comment for a user
async function Get_UserComment(uid){

}

//get comment for a node
async function Get_NodeComment(nid){
 
}

//delete a comment from db
//params:user name
async function DEL_Comment(uid,cid) {
   return await db.none("DELETE FROM comment WHERE uid=$1 AND comment_id=$2;",[uid,cid]);
}

//delete a node from collection
async function DEL_Fav(uid,node_id) {
  
}

//delete a node posted by uid
async function DEL_Node(uid,node_id){
  
}

//update user's password
async function Update_pw(uid,pw,salt){
  return await db.none("UPDATE user_table SET password=$1,salt=$2 WHERE name=$3",[pw,salt,uid]);
}

//update user's email
async function Update_email(uid,email){
  return await db.none("UPDATE user_table SET email=$1 WHERE name=$2",[email,uid]);
}

exports.findUser = findUser;
exports.insertUser = insertUser;
exports.DEL_Comment = DEL_Comment;
exports.Update_email = Update_email;
exports.Update_pw = Update_pw;
