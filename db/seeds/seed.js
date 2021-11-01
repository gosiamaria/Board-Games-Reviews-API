const db = require("../");
const format = require("pg-format");
const { categoryData, commentData, reviewData, userData } = require("../data/development-data/index.js");


const seed = ({ categoryData, commentData, reviewData, userData }) => {
  //drop tables if exist: comments, reviews, users, categories
  return db.query(`DROP TABLE IF EXISTS comments;`).then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`).then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`).then(() => {
          return db.query(`DROP TABLE IF EXISTS categories`)
        })
      })
    })
    .then(() => {
      // 💛CREATING TABLE categories 

    })


  // 2. insert data
};

module.exports = seed;
