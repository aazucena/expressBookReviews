// @ts-check
import { test, expect } from "@playwright/test";
import { API_PREFIX } from "../src/variables/index.js";

test.afterAll(async ({ request }) => {
  await request.post(API_PREFIX + "/customer/logout");
});

test("register user", async ({ request }) => {
  const response = await request.post(API_PREFIX + "/customer/register", {
    data: {
      username: "user",
      password: "password",
    },
  });
  const result = await response.text();
  expect(result).toBeTruthy();
});

test("login user", async ({ request }) => {
  await request.post(API_PREFIX + "/customer/register", {
    data: {
      username: "customer",
      password: "pass",
    },
  });
  const response = await request.post(API_PREFIX + "/customer/login", {
    data: {
      username: "customer",
      password: "pass",
    },
  });
  const result = await response.text();
  expect(result).toBeTruthy();
});

test("read me", async ({ request }) => {
  await request
    .post(API_PREFIX + "/customer/register", {
      data: {
        username: "test",
        password: "test",
      },
    })
    .then((response) => response.text());
  await request
    .post(API_PREFIX + "/customer/login", {
      data: {
        username: "test",
        password: "test",
      },
    })
    .then((response) => response.text());
  const result = await request
    .get(API_PREFIX + "/customer/me")
    .then((response) => response.json());
  expect(result).toBeTruthy();
});

test("logout user", async ({ request }) => {
  await request.post(API_PREFIX + "/customer/register", {
    data: {
      username: "test",
      password: "test",
    },
  });
  await request.post(API_PREFIX + "/customer/login", {
    data: {
      username: "test",
      password: "test",
    },
  });
  const result = await request
    .post(API_PREFIX + "/customer/logout")
    .then((response) => response.text());
  expect(result).toBeTruthy();
});
