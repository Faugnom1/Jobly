"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  adminToken, 
} = require("./_testCommon"); 

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /jobs", function () {
  const newJob = {
    title: "New DevOps Specialist",
    salary: 95000,
    equity: "0",
    companyHandle: "netflix",
  };

  test("ok for admins", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob)
        .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        ...newJob,
      },
    });
  });
});

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Software Engineer",
          salary: 120000,
          equity: "0",
          CompanyHandle: "google",
        },
        {
          id: expect.any(Number),
          title: "Data Scientist",
          salary: 110000,
          equity: "0.2",
          CompanyHandle: "amazon",
        },
      ],
    });
  });
});
