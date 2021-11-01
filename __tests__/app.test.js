const db = require('../db/index.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require("../app.js");
const request = require("supertest");


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/api/categories', () => {
  describe('GET', () => {
    it('responds with 200 and an array of category objects', () => {
      return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        //expect(body).toBeInstanceOf(Array);
        body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String)
            })
          ) 
        })
      })
    })
  })
})
