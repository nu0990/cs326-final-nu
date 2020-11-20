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

exports.findUser = findUser;
exports.insertUser = insertUser;
