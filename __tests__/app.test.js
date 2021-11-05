const db = require('../db/index.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require("../app.js");
const request = require("supertest");
const { checkIfExists } = require('../utils.js');
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app test", () => {
	it("responds with 404, responds with message path not found", () => {
		return request(app)
		.get("/api/not_a_path")
		.expect(404)
		.then(({ body }) => {
		expect(body.msg).toBe("Path not found");
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

describe('/api/reviews/:review_id', () => {
  describe('GET', () => {
    it('responds with 200 and returns the review object by review_id with following properties: owner, title, review_id, review_body, designer, review img url, category, created_at, votes, comment_count', () => {
      const review_id = 3;
      return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(200)
      .then(({ body }) => {
        const { review } = body;
        expect(review).toEqual(
          expect.objectContaining({
          owner: expect.any(String),
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number)
          })
        )
        expect(review.votes).toBe(5);
        expect(review.comment_count).toBe(3)
      })
    })

    it('responds with 400 if the review_id is wrong type - bad request', () => {
      const review_id = 'not_an_id';
      return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - invalid data type');
      })
    })

    it('responds with 404 if the review_id is valid but doesn\'t exist - not found', () => {
      const review_id = 9999;
      return request(app)
      .get(`/api/reviews/${review_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found');
      })
    })
  })

  describe('PATCH', () => {
    it('responds with 200 and the updated review if the updated votes are incremented', () => {
      const review_id = 2;
      const votesUpdate = {
        inc_votes: 5
      }
      return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: 'Jenga',
          review_body: 'Fiddly fun for all the family',
          designer: 'Leslie Scott',
          review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          votes: 10,
          category: 'dexterity',
          owner: 'philippaclaire9',
          created_at: '2021-01-18T10:01:41.251Z'
        })
      })
    })

    it('responds with 200 and the updated review if the updated votes are decremented', () => {
      const review_id = 2;
      const votesUpdate = {
        inc_votes: -20
      }
      return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: 'Jenga',
          review_body: 'Fiddly fun for all the family',
          designer: 'Leslie Scott',
          review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          votes: -15,
          category: 'dexterity',
          owner: 'philippaclaire9',
          created_at: '2021-01-18T10:01:41.251Z'
        })
      })
    })

    it('responds with 404 if the review_id is valid but not found', () => {
      const review_id = 9999;
      const votesUpdate = {
        inc_votes: 30
      }
      return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(votesUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found')
      })
    })

    it('responds with 400 if the review_id is invalid -bad request', () => {
      const review_id = 'not_an_id';
      const votesUpdate = {
        inc_votes: 30
      }
      return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - invalid data type')
      })
    })

    it('responds with 400 when passed with an invalid inc_vote -bad request', () => {
      const review_id = 2;
      const votesUpdate = {
        inc_votes: 'not_a_number'
      }
      return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - invalid data type')
      })
    })

    it('responds with 400 if passed with no inc_vote', () => {
      const review_id = 2;
      const votesUpdate = {};
      return request(app)
      .patch(`/api/reviews/${review_id}`)
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - cannot pass an empty object')
      })
    })
  })
})

describe('/api/reviews', () => {
  describe('GET', () => {
    it('responds with 200 and returns all reviews with following columns: review_id, owner, title, votes, category, review_img_url, created_at, comment_count', () => {
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
              votes: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(Number)
            })
          )
        })
      })
    })

    it('responds with 200 and accepts a query sort_by which sorts the reviews by any valid column (defaults to date)', () => {
      return request(app)
      .get('/api/reviews?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy('votes', {descending: true});
      })
    })

    it('responds with 400 when a given query is not an existing column', () => {
      return request(app)
      .get('/api/reviews?sort_by=not_a_column')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort_by query input');
      })
    })

    it('responds with 200 and all reviews sorted by date by default', () => {
      return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy('created_at', {descending: true});
      })
    })

    it('responds with 200 and accepts an order query which can be set to asc or desc for ascending or descending (defaults to descending)', () => {
      return request(app)
      .get('/api/reviews?order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy('created_at');
      })
    })

    it('responds with 400 if a given order query is not valid', () => {
      return request(app)
      .get('/api/reviews?order=not_an_order')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid order query input');
      })
    })

    it('responds with 200 and accepts both queries: sort_by and order', () => {
      return request(app)
      .get('/api/reviews?sort_by=votes&&order=asc')
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy('votes');
      })
    })

    it('responds with 400 and if one of the two queries passed(sort_by or order) are invalid - bad request', () => {
      return request(app)
      .get('/api/reviews?sort_by=not_a_column&&order=asc')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid sort_by query input');
      })
    })

    it('responds with 200 and accepts a category query, which filters the reviews by the category value specified in the query', () => {
      const category = 'dexterity'
      return request(app)
      .get(`/api/reviews?category=${category}`)
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        reviews.forEach((review) => {
          expect(review.category).toBe('dexterity')
        })
      })
    })

    it('responds with 404 if the category passed is valid but doesn\'t exist', () => {
      const category = 'non_existent_category'
      return request(app)
      .get(`/api/reviews?category=${category}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('No items found')
      })
    })
  })
})

describe('/api.reviews/:review_id/comments', () => {
  describe('GET', () => {
    it('responds with 200 and returns an array of comments for the given review_id with following properties for each comment:comment_id, votes, created_at, author, body', () => {
      const review_id = 3;
      return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String)
            })
          )
        })
        expect(comments[0]).toEqual({
          comment_id: 2,
          votes: 13,
          created_at: "2021-01-18T10:09:05.410Z",
          author: 'mallionaire',
          body: 'My dog loved this game too!',
        })
      })
    })
    
    it('responds with 404 if review_id is not found', () => {
      const review_id = 9999;
      return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Review_id does not exist')
      })
    })

    it('responds with 200 and an empty array if no comments found for that review', () => {
      const review_id = 1;
      return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([])
      })
    })

    it('responds with 400 if review_id is invalid type - bad request', () => {
      const review_id = 'not_an_id';
      return request(app)
      .get(`/api/reviews/${review_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - invalid data type')
      })
    })

    it('responds with 404 if given an invalid endpoint(ie. typo in \'comments\'', () => {
      const review_id = 3;
      return request(app)
      .get(`/api/reviews/${review_id}/not_comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found')
      })
    })
  })

  describe('POST', () => {
    it('responds with 201 and the posted comment', () => {
      const review_id = 2;
      const newComment = {
        username: 'mallionaire',
        body: 'Jenga is a fun family game'
      }
      return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { newComment } = body;
        expect(newComment).toEqual(
          expect.objectContaining({
            author: "mallionaire", 
            body: "Jenga is a fun family game", 
            comment_id: expect.any(Number), 
            created_at: expect.any(String), 
            review_id: 2, 
            votes: expect.any(Number)
          })  
        )
      })
    })

    it('responds with 404 if the review_id is valid but doesn\'t exist - not found', () => {
      const review_id = 9999;
      const newComment = {
        username: 'mallionaire',
        body: 'Jenga is a fun family game'
      }
      return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`${review_id} not found`)
      })
    })

    it('responds with 404 if passed a username that does not exist', () => {
      const review_id = 2;
      const newComment = {
        username: 'not_existing_username',
        body: 'bla bla bla'
      }
      return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body}) => {
        expect(body.msg).toBe(`not_existing_username not found`)
      })
    })

    it('reponds with 400 if passed review_id is invalid(not a number)', () => {
      const review_id = 'not_a_number';
      const newComment = {
        username: 'mallionaire',
        body: 'Jenga is a fun family game'
      }
      return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body}) => {
        expect(body.msg).toBe('Bad request - invalid data type')
      })
    })

    it('responds with 400 if passed with empty body object', () => {
      const review_id = 2;
      const newComment = {}
      return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body}) => {
        expect(body.msg).toBe("Invalid request body")
      })
    })

    it('responds with 400 if passed with a wrong request body ie.too few/too many columns', () => {
      const review_id = 2;
      const newComment = {username: 'mallionaire'}
      return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body}) => {
        expect(body.msg).toBe("Invalid request body")
      })
    })

    it('responds with 400 if passed the right amount of columns but wrong names', () => {
      const review_id = 2;
      const newComment = {
        not_a_column_name: 'mallionaire',
        not_a_column_name_either: 'Jenga is a fun family game'
      }
      return request(app)
      .post(`/api/reviews/${review_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request body")
      })
    })
  })
})

describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    it('responds with 204, deletes the comment by comment_id and outputs no content', () => {
      const comment_id = 1;
      return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then(() => {
        expect(checkIfExists("comments", "comment_id", comment_id)).rejects.toEqual({msg: `${comment_id} not found`, status: 404}); 
      })
    })

    it('responds with 404 if passed with a (valid) comment_id that does not exist', () => {
      const comment_id2 = 9999;
      return request(app)
      .delete(`/api/comments/${comment_id2}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`${comment_id2} not found`)
      })
    })

    it('responds with 400 if passed with an invalid comment_id type ie.string', () => {
      const comment_id = 'not_a_number';
      return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - invalid data type')
      })
    })
  })

  describe('PATCH', () => {
    it('responds with 200 and the updated comment if the updated votes are incremented', () => {
      const comment_id = 1;
      const votesUpdate = {
        inc_votes: 5
      }
      return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: 'I loved this game too!',
          votes: 21,
          author: 'bainesface',
          review_id: 2,
          created_at: '2017-11-22T12:43:33.389Z'
        })
      })
    })

    it('responds with 200 and the updated review if the updated votes are decremented', () => {
      const comment_id = 1;
      const votesUpdate = {
        inc_votes: -5
      }
      return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: 'I loved this game too!',
          votes: 11,
          author: 'bainesface',
          review_id: 2,
          created_at: '2017-11-22T12:43:33.389Z'
        })
      })
    })

    it('responds with 404 if the comment_id is valid but not found', () => {
      const comment_id = 9999;
      const votesUpdate = {
        inc_votes: 5
      }
      return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votesUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found')
      })
    })

    it('responds with 400 if the review_id is invalid -bad request', () => {
      const comment_id = 'not_a_number';
      const votesUpdate = {
        inc_votes: 5
      }
      return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - invalid data type')
      })
    })

    it('responds with 400 when passed with an invalid inc_vote -bad request', () => {
      const comment_id = 1;
      const votesUpdate = {
        inc_votes: 'not_a_number'
      }
      return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - invalid data type')
      })
    })

    it('responds with 400 if passed with no inc_vote', () => {
      const comment_id = 1;
      const votesUpdate = {};
      return request(app)
      .patch(`/api/comments/${comment_id}`)
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request - cannot pass an empty object')
      })
    })
  })
})

describe('/api', () => {
  describe('GET', () => {
    it('responds with 200 and JSON describing all the available endpoints on the API', () => {
      return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
    })
  })
})

describe('/api/users', () => {
  describe('GET', () => {
    it('Responds with 200 and returns an array of user objects, each containing the property username', () => {
      return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          )
        })
        expect(users[0]).toEqual({username: 'mallionaire'})
      })
    })
  })
})

describe('/api/users/:username', () => {
  describe('GET', () => {
    it('responds with 200 and returns a user object with username, avatar_url and name', () => {
      const username = 'dav3rid';
      return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: 'dav3rid',
          name: 'dave',
          avatar_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
        })
      })
    })

    it('responds with 404 if the username is not found (doesn\'t exist', () => {
      const username = 'non_existing_username';
      return request(app)
      .get(`/api/users/${username}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Path not found')
      })
    })
  })
})



// GET /api/users  ✅ 
// GET /api/users/:username ✅ 
// PATCH /api/comments/:comment_id

