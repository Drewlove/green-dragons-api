const knex = require('knex')
const app = require('../src/app')
const {makeTestRows, makeMaliciousRow} = require('./students.fixtures')
const logger = require('../src/logger')

const API_TOKEN = '5abc66fb-8f77-4033-8b39-6d5fd474fa58'

const table = {
    name: 'student',
    endpoint: 'students', 
    columns: ['first_name', 'last_name', 'birth_date'], 
    rowId: 'student_id'
  }

describe(`${table.name} endpoints`, function() {
  let db
  
  before('make knex instance', () => {
      db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    before('clean the table', () => db.raw(`TRUNCATE table ${table.name} RESTART IDENTITY CASCADE`))

    afterEach('cleanup',() => db.raw(`TRUNCATE table ${table.name} RESTART IDENTITY CASCADE`))

    describe(`GET /api/${table.endpoint}`, () => {
        context(`Given no rows in table ${table.name}`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                .get(`/api/${table.endpoint}`)
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(200, [])
            })
        })
    })
    
    context(`Given there are rows in table ${table.name} in the database`, () => {
        const testRows = makeTestRows();  
        beforeEach('insert rows', () => {
            return db
            .into(table.name)
            .insert(testRows)
        })
        it('responds with 200 and all of the rows', () => {
            return supertest(app)
            .get(`/api/${table.endpoint}`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(200)
            .then(res => {
                const resReformattedDates = res.body.map(row => {
                    return  {...row, birth_date: new Date(row.birth_date)}
                })
                expect(testRows).to.eql(resReformattedDates)
            })
        })
    })
    
    context(`Given an XSS attack`, () => {
        const {maliciousRow, expectedRow} = makeMaliciousRow()
        beforeEach('insert malicious row', () => {
            return db
            .into(table.name)
            .insert(maliciousRow)
        })

        it('removes XSS attack content', () => {
            return supertest(app)
            .get(`/api/${table.endpoint}`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(200)
            .expect(res => {
                expect(res.body[0].first_name).to.eql(expectedRow.first_name)
            })
        })
    })
    
    describe(`GET /api/${table.endpoint}/:rowId`, () => {
        context(`Given no rows`, () => {
            it(`responds with 404`, () => {
                const rowId = 123456
                return supertest(app)
                .get(`/api/${table.endpoint}/${rowId}`)
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(404, { error: { message: `Row from table: '${table.name}' doesn't exist`}})
            })
        })
        
        context('Given there are rows in the database', () => {
            const testRows = makeTestRows();
            beforeEach('insert rows', () => {
                return db
                .into(table.name)
                .insert(testRows)
            })
            it('responds with 200 and the specified row', () => {
                const rowId = 1
                return supertest(app)
                .get(`/api/${table.endpoint}/${rowId}`)
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(200)
                .then(res => {
                    const resReformattedDate = {...res.body, birth_date: new Date(res.body.birth_date)}
                    expect(resReformattedDate).to.eql(testRows[rowId-1])
                })
            })
        })
    })
    
    context(`Given an XSS attack row`, () => {
        const { maliciousRow, expectedRow } = makeMaliciousRow()        
        beforeEach('insert malicious row', () => {
            return db
            .into(table.name)
            .insert(maliciousRow)
        })
        it('removes XSS attack content', () => {
            return supertest(app)
            .get(`/api/${table.endpoint}/${maliciousRow[table.rowId]}`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(200)
            .expect(res => {
                expect(res.body.first_name).to.eql(expectedRow.first_name)
            })
        })
    })

      describe(`POST /api/${table.endpoint}`, () => {
        it(`creates a row, responding with 201 and the new row`, () => {
          const newRow = {
            first_name: 'Bob', 
            last_name: 'Bobberson', 
            birth_date: new Date('1982-11-14'),
          }
          return supertest(app)
            .post(`/api/${table.endpoint}`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .send(newRow)
            .expect(201)
            .expect(res => {
                const resBirthdate = new Date(res.body.birth_date)
              expect(res.body.first_name).to.eql(newRow.first_name)
              expect(res.body.last_name).to.eql(newRow.last_name)
              expect(resBirthdate).to.eql(newRow.birth_date)
              expect(res.body).to.have.property(`${table.rowId}`)
              expect(res.headers.location).to.eql(`/api/${table.endpoint}/${res.body[table.rowId]}`)
            })
            .then(res =>
              supertest(app)
                .get(`/api/${table.endpoint}/${res.body[table.rowId]}`)
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(res.body)
            )
        })

        table.columns.forEach(field => {
          const newRow = {
            first_name: 'Testy',
            last_name: 'New Name',
            birth_date: '01-01-1980'
          }

          it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newRow[field]
            return supertest(app)
              .post(`/api/${table.endpoint}`)
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .send(newRow)
              .expect(400, {
                error: { message: `Missing '${field}' in request body` }
              })
          })
        })
        it('removes XSS attack content from response', () => {
          const { maliciousRow, expectedRow } = makeMaliciousRow()
          return supertest(app)
            .post(`/api/${table.endpoint}`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .send(maliciousRow)
            .expect(201)
            .expect(res => {
              expect(res.body.first_name).to.eql(expectedRow.first_name)
            })
        })
      })

      describe(`DELETE /api/${table.name}/:rowId`, () => {
        context(`Given no rows`, () => {
          it(`responds with 404`, () => {
            const testRowId = 123456
            return supertest(app)
              .delete(`/api/${table.endpoint}/${testRowId}`)
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .expect(404, 
                {error: { message: `Row from table: '${table.name}' doesn't exist`}}
                )
          })
        })

        context('Given there are rows in table', () => {
          const testRows = makeTestRows();

          beforeEach('insert rows', () => {
              return db
              .into(table.name)
              .insert(testRows)
            })

          it('responds with 204 and removes the row', () => {
            const idToRemove = 1
            return supertest(app)
              .delete(`/api/${table.endpoint}/${idToRemove}`)
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .expect(204)
              .then(res => {
                const expectedRows = testRows.filter(row => row[table.rowId]!== idToRemove)
                supertest(app)
                .get(`/api/${table.endpoint}`)
                .expect(expectedRows)
              })
          })
        })
    })

      describe(`PATCH /api/${table.endpoint}/:rowId`, () => {
        context(`Given no rows`, () => {
          it(`responds with 404`, () => {
            const rowId = 123456
            return supertest(app)
              .patch(`/api/${table.endpoint}/${rowId}`)
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .expect(404, { error: { message: `Row from table: '${table.name}' doesn't exist`}})
          })
        })

        context('Given there are rows in the database', () => {
          const testRows = makeTestRows();

          beforeEach('insert rows', () => {
            return db
              .into(table.name)
              .insert(testRows)
          })

          it('responds with 204 and updates the row', () => {
            const idToUpdate = 2
            const updatedRow = {
                first_name: 'New First Name',
                last_name: 'New Last Name',
                birth_date: new Date('01-01-1900')
            }
            const expectedRow = {
              ...testRows[idToUpdate - 1],
              ...updatedRow
            }

            return supertest(app)
              .patch(`/api/${table.endpoint}/${idToUpdate}`)
              .send(updatedRow)
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .expect(204)
              .then(res => {
                supertest(app)
                  .get(`/api/${table.endpoint}/${idToUpdate}`)
                  .set('Authorization', `Bearer ${API_TOKEN}`)
                  .then(res => {
                      const resReformattedDate = {...res.body, birth_date : new Date(res.body.birth_date)}
                      expect(expectedRow).to.eql(resReformattedDate)  
                  })
              })
          })

          it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 2
            return supertest(app)
              .patch(`/api/${table.endpoint}/${idToUpdate}`)
              .send({ irrelevantField: 'foo' })
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .expect(400, {
                error: {
                    message: `Request body content must contain at least one of the following: ${table.columns}`
                }
              })
          })

          it(`responds with 204 when updating only a subset of fields`, () => {
            const idToUpdate = 2
            const updatedRow = {
                last_name: 'new last name',
            }
            const expectedRow = {
                ...testRows[idToUpdate - 1],
                ...updatedRow
              }

            return supertest(app)
              .patch(`/api/${table.endpoint}/${idToUpdate}`)
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .send({
                ...updatedRow,
                fieldToIgnore: 'should not be in GET response'
              })
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/api/${table.endpoint}/${idToUpdate}`)
                  .set('Authorization', `Bearer ${API_TOKEN}`)
                  .then(res => {
                    const resReformattedDate = {...res.body, birth_date : new Date(res.body.birth_date)}
                    expect(expectedRow).to.eql(resReformattedDate)  
                })
              )
          })
        })
      })
    })
