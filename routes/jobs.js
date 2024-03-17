"use strict";

/** Routes for jobs. */ 

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const { authenticateJWT } = require("../middleware/auth");
const { ensureAdmin } = require("../middleware/auth");

const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");

const router = new express.Router();

/** 
 * POST / { job } => { job }
 *
 * Adds a new job posting. Requires the job details as input and returns
 * the newly created job information.
 * 
 * The job details should include: title, salary, equity, companyHandle.
 * 
 * Returns the created job details including id: {id, title, salary, equity, companyHandle}
 * 
 * Authorization required: Logged in, Admin
 */
router.post("/", async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
      }
  
      const job = await Job.create(req.body);
      return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });

/** 
 * GET / => { jobs: [...] }
 *
 * Returns list of all jobs. Can filter the list of jobs returned by title,
 * minimum salary, and equity. The filters are passed as query parameters.
 * 
 * Authorization: none
 */
router.get("/", async function (req, res, next) {
    try {
      const { title, salary, equity } = req.query;
  
      const filters = {};
      if (title) filters.title = title;
      if (salary) filters.salary = parseInt(salary);
      if (equity) filters.equity = equity;
  
      const jobs = await Job.filterByParams(filters);
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });

module.exports = router;
