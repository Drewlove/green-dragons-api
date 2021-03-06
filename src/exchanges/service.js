//change table.name, getById include actual column name of row id, example 'student_id'
const table = {
  name: "exchange",
  parentTable: "student",
  rowDate: "exchange_date",
};

const service = {
  getAllRows(knex) {
    return knex.select("*").from(table.name).orderBy(table.rowDate, "ASC");
  },
  getAllRowsMatchingParentId(knex, parent_row_id) {
    return knex
      .select("*")
      .from(table.name)
      .where(`${table.parentTable}_id`, parent_row_id)
      .orderBy(table.rowDate, "DESC");
  },
  getById(knex, row_id) {
    return knex
      .from(table.name)
      .select("*")
      .where(`${table.name}_id`, row_id)
      .first();
  },
  insertRow(knex, newRow) {
    return knex
      .insert(newRow)
      .into(table.name)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateRow(knex, row_id, newFields) {
    return knex(table.name).where(`${table.name}_id`, row_id).update(newFields);
  },
  deleteRow(knex, row_id) {
    return knex(table.name).where(`${table.name}_id`, row_id).delete();
  },
};

module.exports = service;
