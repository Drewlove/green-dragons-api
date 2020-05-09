const table = {
  name: "challenge_entry",
  parentTable: "student",
};

const service = {
  getAllRows(knex) {
    return knex.select("*").from(table.name);
  },
  getAllRowsMatchingStudent(knex, student_id) {
    return knex.select("*").from(table.name).where("student_id", student_id);
  },
  getAllRowsMatchingStudentAndChallenge(knex, student_id, challenge_id) {
    return knex.select("*").from(table.name).where({
      student_id: student_id,
      challenge_id: challenge_id,
    });
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
