const db = require('../db/index.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const { checkIfExists } = require('../utils.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Utils functions', () => {
    it('checks the inputed value exists ie. review_id or username', () => {
        const username = 'philippaclaire9';
        const table = 'users';
        const column = 'username';
        return checkIfExists(table, column, username).then((result)=> {
            expect(result).toBe(`The value ${username} exists`)
        })
    })
    it('returns a promise rejection if the value passed does not exist', () => {
        expect(checkIfExists('reviews', 'review_id', 9999)).rejects.toEqual({msg: '9999 not found', status: 404})
    })
})