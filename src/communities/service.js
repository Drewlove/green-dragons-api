const tableName = 'community'

const service = {
    getAllRows(knex){
        return knex
        .select('*')
        .from(tableName)
    }, 
    getById(knex, row_id){
        return knex
        .from(tableName)
        .select('*')
        .where('community_id', row_id)
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
    updateRow(knex, row_id, newFields){
        return knex(tableName)
        .where('community_id', row_id)
        .update(newFields)
    }, 
    deleteRow(knex, row_id){
        return knex(tableName)
        .where('community_id', row_id)
        .delete()
    }
}

module.exports = service