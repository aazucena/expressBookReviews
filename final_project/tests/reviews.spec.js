// @ts-check
import { test, expect } from "@playwright/test";
import { API_PREFIX } from "../src/variables/index.js";
import { BOOKS } from "../src/data/index.js";

const getRandomBook = () => {
  return BOOKS[Math.floor(Math.random() * BOOKS.length)];
};

test.beforeAll(async ({ request }) => {
  await request
    .post(API_PREFIX + "/customer/register", {
      data: {
        username: "customer",
        password: "pass",
      },
    })
    .then((response) => response.text());
});

test.beforeEach(async ({ request }) => {
  await request
    .post(API_PREFIX + "/customer/login", {
      data: {
        username: "customer",
        password: "pass",
      },
    })
    .then((response) => response.text());
});

test.afterEach(async ({ request }) => {
  await request
    .post(API_PREFIX + "/customer/logout")
    .then((response) => response.text());
});

test("create review", async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const endpoint = API_PREFIX + "/customer/auth/review/" + ISBN;
  const response = await request.post(endpoint, {
    data: {
      rating: 5,
      comment: "Great book!",
    },
  });
  const result = await response.json();
  expect(result).toBeTruthy();
});

test("update review", async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const createEndpoint = API_PREFIX + "/customer/auth/review/" + ISBN;
  const review = await request
    .post(createEndpoint, {
      data: {
        rating: 5,
        comment: "Great book!",
      },
    })
    .then((response) => response.json());

  const updateEndpoint = API_PREFIX + "/customer/auth/review/" + review.data.id;
  const updateResponse = await request.patch(updateEndpoint, {
    data: {
      rating: 10,
      comment: "Amazing book!!",
    },
  });
  const result = await updateResponse.json();
  expect(result).toBeTruthy();
});

test("delete review", async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const response = await request.post(
    API_PREFIX + "/customer/auth/review/" + ISBN,
    {
      data: {
        rating: 5,
        comment: "Great book!",
      },
    },
  );
  const review = await response.json();

  const deleteResponse = await request.delete(
    API_PREFIX + "/customer/auth/review/" + review.data.id,
  );
  const result = await deleteResponse.text();
  expect(result).toBeTruthy();
});
