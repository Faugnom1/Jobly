"use strict";

const db = require("../db");
const Job = require("../models/job");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Job.findAll", function () {
  test("works: no filter", async function () {
    const jobs = await Job.findAll();
    expect(jobs).toEqual([
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
    ]);
  });
});

describe("Job.filterByParams", function () {
  test("works: with title filter", async function () {
    const jobs = await Job.filterByParams({ title: "Engineer" });
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "Software Engineer",
        salary: 120000,
        equity: "0",
        CompanyHandle: "google",
      },
    ]);
  });

  test("works: with equity filter", async function () {
    const jobs = await Job.filterByParams({ equity: true });
    expect(jobs).toEqual([
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
