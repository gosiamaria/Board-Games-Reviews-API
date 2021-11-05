const db = require("../");
const format = require("pg-format");
//const { dropTablesIfExist } = require(".../utils.js")

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`)
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories`)
    })
    
    //return dropTablesIfExist('comments', 'reviews', 'users', 'categories')

    .then(() => {
      return db.query(`
        CREATE TABLE categories (
          slug VARCHAR NOT NULL PRIMARY KEY,
          description VARCHAR NOT NULL,
          CONSTRAINT name_unique UNIQUE (slug)
        );`)
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR NOT NULL PRIMARY KEY,
          avatar_url VARCHAR,
          name VARCHAR(250) NOT NULL,
          CONSTRAINT username_unique UNIQUE (username)
        );`)
    })
    .then(() => {
      return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          review_body VARCHAR NOT NULL,
          designer VARCHAR,
          review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0,
          category VARCHAR REFERENCES categories(slug) ON DELETE CASCADE NOT NULL,
          owner VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `)
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR REFERENCES users(username) ON DELETE CASCADE NOT NULL,
          review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE NOT NULL,
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          body VARCHAR
        );
      `)
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO categories (slug, description) VALUES %L RETURNING*;`,
          categoryData.map((category) => [category.slug, category.description])
      );
      return db.query(queryStr); 
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING*;`,
        userData.map((user) => [user.username, user.avatar_url, user.name])
      );
      return db.query(queryStr);
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at) VALUES %L RETURNING*;`,
        reviewData.map((review) => [review.title, review.review_body, review.designer, review.review_img_url, review.votes, review.category, review.owner, review.created_at])
      );
      return db.query(queryStr);
    })
    .then(() => {
      const queryStr = format(
        `INSERT INTO comments (author, review_id, votes, created_at, body) VALUES %L RETURNING*;`,
        commentData.map((comment) => [comment.author, comment.review_id, comment.votes, comment.created_at, comment.body])
      );
      return db.query(queryStr);
    })
};

module.exports = seed;
