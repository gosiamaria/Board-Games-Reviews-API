const db = require('../db/index.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require("../app.js");
const request = require("supertest");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app test", () => {
	it("status:404, responds with message path not found", () => {
		return request(app)
		.get("/api/not_a_path")
		.expect(404)
		.then(({ body }) => {
		expect(body.msg).toBe("path not found");
		});
	});
});

describe('/api/categories', () => {
  describe('GET', () => {
    it('responds with 200 and an array of category objects', () => {
      return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
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

describe('/api/reviews', () => {
  describe('GET', () => {
    it('responds with 200 and returns all reviews', () => {
      return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              owner: expect.any(String),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              votes: expect.any(Number),
            })
          )
        })
      })
    })

    it('responds with 200 and returns the review object by review_id with following properties: owner, title, review_id, review_body, designer, review img url, category, created_at, votes, comment_count', () => {
      return request(app)
      .get('/api/reviews/2')
      .expect(200)
      .then(({ body }) => {
        
        const { review } = body;
        console.log(review);

        expect(review).toEqual(
          expect.objectContaining({
          owner: expect.any(String),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String)
          })
        )
        expect(review.votes).toBe(5);
        //expect(review.comment_count).toBe(3)
      })
    })
  })
})
