"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Job{
  /** Given a company handle, return data about company.
   *
   * 
   *   Returns jobs is [{ id, title, salary, equity, companyHandle }, ...]
   *
   * Throws NotFoundError if not found.
   */
static async findAll() {
    const jobsRes = await db.query(
      `SELECT id,
              title,
              salary,
              equity,
              company_handle AS "CompanyHandle"
       FROM jobs
       ORDER BY title`
    );
    return jobsRes.rows;
  }

  static async filterByParams({ title, minSalary, equity }) {
    let jobs = await this.findAll();

    // Apply filtering based on query parameters
    if (title) {
      jobs = jobs.filter(job => job.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (minSalary) {
      jobs = jobs.filter(job => job.salary >= parseInt(salary));
    }
    if (equity === true) {
        jobs = jobs.filter(job => job.equity > 0);
      }

    return jobs;
  }
}

module.exports = Job;