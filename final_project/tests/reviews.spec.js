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
  await request.post(API_PREFIX + "/customer/auth/reviews/clear");
  await request
    .post(API_PREFIX + "/customer/logout")
    .then((response) => response.text());
});

test("create review", async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const reviewsEndpoint = API_PREFIX + "/customer/auth/reviews/" + ISBN;
  const beforeResponse = await request.get(reviewsEndpoint);
  const beforeData = await beforeResponse.json();
  expect(beforeData.data.length <= 0).toBeTruthy();

  const endpoint = API_PREFIX + "/customer/auth/review/" + ISBN;
  const response = await request.post(endpoint, {
    data: {
      rating: 5,
      comment: "Great book!",
    },
  });
  const result = await response.json();
  expect(result).toBeTruthy();

  const afterResponse = await request.get(reviewsEndpoint);
  const afterData = await afterResponse.json();
  expect(afterData.data.length >= 1).toBeTruthy();
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
  const reviewsEndpoint = API_PREFIX + "/customer/auth/reviews/" + ISBN;
  const beforeResponse = await request.get(reviewsEndpoint);
  const beforeData = await beforeResponse.json();
  expect(beforeData.data.length > 0).toBeTruthy();

  const updateEndpoint = API_PREFIX + "/customer/auth/review/" + review.data.id;
  const updateResponse = await request.patch(updateEndpoint, {
    data: {
      rating: 10,
      comment: "Amazing book!!",
    },
  });
  const result = await updateResponse.json();
  expect(JSON.stringify(result.data)).not.toBe(JSON.stringify(review.data));
});

test("delete review", async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const reviewsEndpoint = API_PREFIX + "/customer/auth/reviews/" + ISBN;
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

  const beforeResponse = await request.get(reviewsEndpoint);
  const beforeData = await beforeResponse.json();
  expect(beforeData.data.length >= 1).toBeTruthy();

  const deleteResponse = await request.delete(
    API_PREFIX + "/customer/auth/review/" + review.data.id,
  );

  const result = await deleteResponse.text();
  console.log("🚀 ~ result:", result)
  expect(result).toBeTruthy();

  const afterResponse = await request.get(reviewsEndpoint);
  const afterData = await afterResponse.json();
  expect(beforeData.data.length).not.toEqual(afterData.data.length);
  expect(afterData.data.length).toBeLessThan(beforeData.data.length);
});

test("delete review with ISBN", async ({ request }) => {
  const ISBN = getRandomBook().isbn;
  const reviewsEndpoint = API_PREFIX + "/customer/auth/reviews/" + ISBN;
  const response = await request.post(API_PREFIX + "/customer/auth/review/" + ISBN, {
    data: {
      rating: 5,
      comment: "Great book!",
    },
  });
  const review = await response.json();
  
  console.log(review);

  const beforeResponse = await request.get(reviewsEndpoint);
  const beforeData = await beforeResponse.json();
  console.log("🚀 ~ beforeData:", beforeData)
  expect(beforeData.data.length >= 1).toBeTruthy();

  const deleteResponse = await request.delete(
    API_PREFIX + "/customer/auth/review/" + ISBN,
  );

  const result = await deleteResponse.text();
  console.log("🚀 ~ result:", result)
  expect(result).toBeTruthy();

  const afterResponse = await request.get(reviewsEndpoint);
  const afterData = await afterResponse.json();
  console.log("🚀 ~ afterData:", afterData)
  expect(beforeData.data.length).not.toEqual(afterData.data.length);
  expect(afterData.data.length).toBeLessThan(beforeData.data.length);
});
