const { BadRequestError } = require("../expressError");

/**
 * Generates a partial SQL update query string and corresponding values.
 *
 * This function constructs a dynamic SQL UPDATE statement for partially updating an entity. It
 * converts JavaScript camelCase properties to SQL snake_case column names via a mapping object.
 *
 * @param {Object} dataToUpdate - Object with properties to update (key: column name, value: new value).
 * @param {Object} jsToSql - Mapping from camelCase properties to snake_case SQL column names.
 *
 * @returns {Object} Object containing:
 *                   - setCols: SQL query string for the SET clause, with placeholders (e.g., "name"=$1).
 *                   - values: Array of values corresponding to the placeholders in setCols.
 *
 **/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
