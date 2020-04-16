//change tableName, getById include actual column name of row id, example 'student_id'
const tableName = 'student'

const service = {
    getAllRows(knex){
        return knex
        .select('*')
        .from(tableName)
    }, 
    getById(knex, id){
        return knex
        .from(tableName)
        .select('*')
        .where('student_id', id)
        .first()
    }, 
    insertRow(knex, newRow){
        return knex
        .insert(newRow)
        .into(tableName)
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    }, 
    updateRow(knex, id, newFields){
        return knex(tableName)
        .where({id})
        .update(newFields)
    }, 
    deleteRow(knex, id){
        return knex(tableName)
        .where({id})
        .delete()
    }
}

module.exports = service