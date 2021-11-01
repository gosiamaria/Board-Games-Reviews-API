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
      // 🌄 CREATING TABLE categories 
      return db.query(`
        CREATE TABLE categories (
          slug VARCHAR NOT NULL PRIMARY KEY,
          description TEXT,
          CONSTRAINT name_unique UNIQUE (slug)
        );`)
    })
    .then(() => {
      // 🌄 CREATING TABLE users
      return db.query(`
        CREATE TABLE users (
          username VARCHAR NOT NULL PRIMARY KEY,
          avatar_url VARCHAR,
          name VARCHAR(250),
          CONSTRAINT username_unique UNIQUE (username)
        );`)
    })
    .then(() => {
      // 🌄 CREATING TABLE reviews
      return db.query(`
        CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR,
          review_body TEXT,
          designer VARCHAR,
          review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0,
          category VARCHAR REFERENCES categories(slug) ON DELETE CASCADE,
          owner VARCHAR REFERENCES users(username) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
    })
    .then(() => {
      // 🌄 CREATING TABLE comments
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR REFERENCES users(username) ON DELETE CASCADE,
          review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE,
          votes INT DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          body TEXT
        );
      `)
    })
    .then(() => {
      // 😄 INSERTING INTO CATEGORIES
      const queryStr = format(
        `INSERT INTO categories (slug, description) VALUES %L RETURNING*;`,
          categoryData.map((category) => [category.slug, category.description])
      );
      return db.query(queryStr); 
    })
    .then(() => {
      // 😄 INSERTING INTO USERS
      console.log('Inserting into categories done, now inserting into users');
      const queryStr = format(
        `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING*;`,
        userData.map((user) => [user.username, user.avatar_url, user.name])
      );
      return db.query(queryStr);
    })
    .then(() => {
      // 😄 INSERTING INTO REVIEWS
      console.log('Inserting into users done, now inserting into reviews');
      const queryStr = format(
        `INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at) VALUES %L RETURNING*;`,
        reviewData.map((review) => [review.title, review.review_body, review.designer, review.review_img_url, review.votes, review.category, review.owner, review.created_at])
      );
      return db.query(queryStr);
    })
    .then(() => {
      // 😄 INSERTING INTO COMMENTS
      console.log('Inserting into reviews done, now inserting into comments');
      const queryStr = format(
        `INSERT INTO comments (author, review_id, votes, created_at, body) VALUES %L RETURNING*;`,
        commentData.map((comment) => [comment.author, comment.review_id, comment.votes, comment.created_at, comment.body])
      );
    })
    .then(() => {
      console.log('Inserting into comments done');
    })
};

module.exports = seed;
