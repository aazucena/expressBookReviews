// @ts-check
import { test, expect } from '@playwright/test';
import { API_PREFIX } from '../src/variables/index.js';
import { BOOKS } from '../src/data/index.js';

const getRandomBook = () => {
  return BOOKS[Math.floor(Math.random() * BOOKS.length)];
}

test.beforeAll(async ({ request }) => {
  await request.post(API_PREFIX + '/customer/register', {
    data: {
      username: "customer",
      password: "pass"
    }
  });
})

test.beforeEach(async ({ request }) => {
  await request.post(API_PREFIX + '/customer/login', {
    data: {
      username: "customer",
      password: "pass"
    }
  });
});

test.afterEach(async ({ request }) => {
  await request.post(API_PREFIX + '/customer/logout');
});

test('create review', async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const response = await request.post(API_PREFIX + '/customer/auth/review/' + ISBN, {
    data: {
      rating: 5,
      comment: "Great book!"
    }
  });
  const result = await response.json();
  console.log("🚀 ~ result:", result);
  expect(result).toBeTruthy();
});

test('update review', async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const response = await request.post(API_PREFIX + '/customer/auth/review/' + ISBN, {
    data: {
      rating: 5,
      comment: "Great book!"
    }
  });
  const review = await response.json();
  console.log("🚀 ~ review:", review);


  const updateResponse = await request.patch(API_PREFIX + '/customer/auth/review/' + review.data.id, {
    data: {
      rating: 10,
      comment: "Amazing book!!"
    }
  });
  const result = await updateResponse.json();
  console.log("🚀 ~ result:", result);
  expect(result).toBeTruthy();
});

test('delete review', async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const response = await request.post(API_PREFIX + '/customer/auth/review/' + ISBN, {
    data: {
      rating: 5,
      comment: "Great book!"
    }
  });
  const review = await response.json();
  console.log("🚀 ~ review:", review);

  const deleteResponse = await request.delete(API_PREFIX + '/customer/auth/review/' + review.data.id);
  const result = await deleteResponse.text();
  console.log("🚀 ~ result:", result);
  expect(result).toBeTruthy();
});