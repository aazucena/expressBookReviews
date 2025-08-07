// @ts-check
import { test, expect } from '@playwright/test';
import { API_VERSION } from '../src/variables/index.js';


const version = Number(API_VERSION.split(".")[0]);
const API_PREFIX = `/api/v${version}`;

test('has books', async ({ request }) => {
  const response = await request.get(API_PREFIX);
  const data = await response.json();
  expect(data.data.length).toBeGreaterThan(0);
});
