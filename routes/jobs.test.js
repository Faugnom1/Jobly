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

/******************** Post Aurhtorization */

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

/************************************** POST /jobs Authorization */

describe("POST /jobs unauthorized access", function () {
  const newJob = {
    title: "New Unauthorized Job",
    salary: 70000,
    equity: "0",
    companyHandle: "google",
  };

  test("unauth for non-admins", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send(newJob);
    expect(resp.statusCode).toEqual(401);
  });
});

describe("GET /jobs", function () {
  test("ok for all", async function () {
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

/************************************** GET /jobs Filtering */

describe("GET /jobs with filters", function () {
  test("filter by title", async function () {
    const resp = await request(app).get("/jobs?title=Engineer");
    expect(resp.body.jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Software Engineer",
        salary: 120000,
        equity: "0",
        CompanyHandle: "google",
      },
    ]);
  });

  test("filter by minimum salary", async function () {
    const resp = await request(app).get("/jobs?salary=115000");
    expect(resp.body.jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Software Engineer",
        salary: 120000,
        equity: "0",
        CompanyHandle: "google",
      },
    ]);
  });

  test("filter by equity", async function () {
    const resp = await request(app).get("/jobs?equity=true");
    expect(resp.body.jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Data Scientist",
        salary: 110000,
        equity: "0.2",
        CompanyHandle: "amazon",
      },
    ]);
  });
});

