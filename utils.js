const db = require('./db/index.js');

exports.createReferenceObj = (arr, param1, param2) => {
	const newObject = {};
	arr.forEach((object) => (newObject[object[param1]] = object[param2]));
	return newObject;
};

exports.formatArray = (arr, refObj, param1, param2) => {
	const newArr = [];
	arr.forEach((element) => {
		const obj = { ...element };
		const val = obj[param1];
		obj[param2] = refObj[val];
		delete obj[param1];
		newArr.push(obj);
	});
	return newArr;
};

exports.sortByFilter = (sort_by) => {
    const sortColumns = ['votes', 'created_at', 'title', 'designer', 'owner', 'category'];
    if(!sortColumns.includes(sort_by)) {
        return Promise.reject({status:400, msg: 'Invalid sort_by query input'})
    } else {
        return sort_by
    }
}

exports.orderFilter = (order) => {
    const orderWays = ['ASC', 'DESC', 'asc', 'desc'];
    if(!orderWays.includes(order)) {
        return Promise.reject({status:400, msg: 'Invalid order query input'})
    } else {
        return order;
    } 
}

exports.categoryFilter = (category) => {
    const validCategories = ['strategy', 'hidden-roles', 'dexterity', 'push-your-luck', 'roll-and-write', 'deck-building', 'engine-building', 'euro game', 'social deduction', 'children\'s games'];
    if(!validCategories.includes(category)) {
        return Promise.reject({status:404, msg:'No path found'})
    } else {
        return category;
    }
}

exports.checkIfExists = async (table, column, value) => {
    const { rows } = await db.query(
        `SELECT * FROM ${table} WHERE ${column} = $1;`, [value]  
    )
    if(rows.length === 0) {
        return Promise.reject({status:404, msg: `${value} not found`})
    }
}