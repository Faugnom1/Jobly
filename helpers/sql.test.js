const { sqlForPartialUpdate } = require("./sqlForPartialUpdate");
const { BadRequestError } = require("../expressError");

describe("sqlForPartialUpdate", function () {
  test("works: valid inputs", function () {
    const dataToUpdate = { firstName: 'Aliya', age: 32 };
    const jsToSql = { firstName: "first_name" };
    const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ['Aliya', 32],
    });
  });

  test("works: no jsToSql conversion needed", function () {
    const dataToUpdate = { name: 'Test Company', numEmployees: 100 };
    const result = sqlForPartialUpdate(dataToUpdate, {});
    expect(result).toEqual({
      setCols: '"name"=$1, "numEmployees"=$2',
      values: ['Test Company', 100],
    });
  });

  test("throws error with empty data", function () {
    expect(() => {
      sqlForPartialUpdate({}, {});
    }).toThrow(BadRequestError);
  });
});