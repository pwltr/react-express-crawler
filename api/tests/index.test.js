const request = require('supertest')
const app = require('../src')

describe('Test the "/" endpoint', () => {
  test('It should respond with statusCode 200', () => {
    return request(app)
      .get('/')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })
})

describe('Test the "/" endpoint with valid URL', () => {
  test('It should respond with statusCode 200', () => {
    return request(app)
      .get('/?url=https://www.example.com')
      .then(response => {
        expect(response.statusCode).toBe(200)
      })
  })
})

describe('Test the "/" endpoint with invalid URL', () => {
  test('It should respond with body.statusCode 500', () => {
    return request(app)
      .get('/?url=asdf')
      .then(response => {
        expect(response.body.statusCode).toBe(500)
      })
  })
})

describe('Test the "/" endpoint with not existing URL', () => {
  test('It should respond with body.statusCode 404', () => {
    return request(app)
      .get('/?url=https://www.example123123123123.com')
      .then(response => {
        expect(response.body.statusCode).toBe(404)
      })
  })
})

describe('Test that basic scraping works', () => {
  test('It should respond with a pageTitle', () => {
    return request(app)
      .get('/?url=https://www.google.com')
      .then(response => {
        expect(response.body.pageTitle).toBe("Google")
      })
  })
})
