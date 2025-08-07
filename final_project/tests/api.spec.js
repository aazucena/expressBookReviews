// @ts-check
import { test, expect } from '@playwright/test';
import { API_PREFIX } from '../src/variables/index.js';
import { BOOKS } from '../src/data/index.js';

const getRandomBook = () => {
  return BOOKS[Math.floor(Math.random() * BOOKS.length)];
}

test('has books', async ({ request }) => {
  const response = await request.get(API_PREFIX);
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data.length).toBeGreaterThan(0);
});


test('retrieve book by isbn', async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const response = await request.get(API_PREFIX + '/isbn/' + ISBN);
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data).toBeTruthy();
});

test('retrieve book by author', async ({ request }) => {
  const AUTHOR = getRandomBook().author;
  const response = await request.get(API_PREFIX + '/author/' + AUTHOR);
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data.length).toBeGreaterThan(0);
});

test('retrieve book by title', async ({ request }) => {
  const TITLE = getRandomBook().title;
  const response = await request.get(API_PREFIX + '/title/' + TITLE);
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data).toBeTruthy();
});

test('retrieve book reviews by isbn', async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const response = await request.get(API_PREFIX + '/review/' + ISBN);
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data).toBeTruthy();
});