const db = require('../db/index.js');

exports.fetchUsers = () => {
    return db.query(`SELECT username FROM users;`)
    .then(({ rows }) => {
        return rows
    })
}

exports.fetchUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status:404, msg:'Path not found'})
        } else {
            return rows[0]
        }
    })
}