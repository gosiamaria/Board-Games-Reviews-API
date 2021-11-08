const db = require('../db/index.js');

exports.fetchAllCategories = () => {
    return db
    .query(`SELECT * FROM categories;`)
    .then(({ rows }) => {
        return rows;
    })
}
