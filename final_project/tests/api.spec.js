// @ts-check
import { test, expect } from '@playwright/test';
import { API_PREFIX } from '../src/variables/index.js';

test('has books', async ({ request }) => {
  const response = await request.get(API_PREFIX);
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data.length).toBeGreaterThan(0);
});


test('retrieve book by isbn', async ({ request }) => {
  const response = await request.get(API_PREFIX + '/isbn/9780199535661');
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data).toBeTruthy();
});

test('retrieve book by author', async ({ request }) => {
  const response = await request.get(API_PREFIX + '/author/Unknown');
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data.length).toBeGreaterThan(0);
});

test('retrieve book by title', async ({ request }) => {
  const response = await request.get(API_PREFIX + '/title/The Epic Of Gilgamesh');
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data).toBeTruthy();
});

test('retrieve book reviews by isbn', async ({ request }) => {
  const response = await request.get(API_PREFIX + '/review/9780199535661');
  const data = await response.json();
  console.log("🚀 ~ data:", data);
  expect(data.data).toBeTruthy();
});