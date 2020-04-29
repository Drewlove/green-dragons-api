const knex = require('knex')
const app = require('../src/app')
const {makeStudentsArray, makeMaliciousStudent} = require('./students.fixtures')
const logger = require('../src/logger')

// const API_TOKEN = process.env.API_TOKEN

const API_TOKEN = '5abc66fb-8f77-4033-8b39-6d5fd474fa58'


const tableName = 'student'

describe('Users Endpoints', function() {
  let db
  
  before('make knex instance', () => {
      db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    before('clean the table', () => db.raw('TRUNCATE table student RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE table student RESTART IDENTITY CASCADE'))

    describe(`GET /api/students`, () => {
        context(`Given no students`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                .get('/api/students')
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(200, [])
            })
        })
    })
    
    context('Given there are students in the database', () => {
        const testStudents = makeStudentsArray();
        
        beforeEach('insert students', () => {
            return db
            .into('student')
            .insert(testStudents)
        })
        
        it('responds with 200 and all of the students', () => {
            return supertest(app)
            .get('/api/students')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(200)
            .then(res => {
                const resReformattedDates = res.body.map(student => {
                    return  {...student, birth_date: new Date(student.birth_date)}
                })
                expect(testStudents).to.eql(resReformattedDates)
            })
        })
    })
    
    context(`Given an XSS attack`, () => {
        const {maliciousStudent, expectedStudent} = makeMaliciousStudent()
        beforeEach('insert malicious student', () => {
            return db
            .into('student')
            .insert(maliciousStudent)
        })
        
        it('removes XSS attack content', () => {
            return supertest(app)
            .get(`/api/students`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(200)
            .expect(res => {
                expect(res.body[0].first_name).to.eql(expectedStudent.first_name)
            })
        })
    })
    
    describe(`GET /api/students/:rowId`, () => {
        context(`Given no students`, () => {
            it(`responds with 404`, () => {
                const rowId = 123456
                return supertest(app)
                .get(`/api/students/${rowId}`)
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(404, { error: { message: `Row from table: '${tableName}' doesn't exist`}})
            })
        })
        
        context('Given there are students in the database', () => {
            const testStudents = makeStudentsArray();
            
            beforeEach('insert students', () => {
                return db
                .into('student')
                .insert(testStudents)
            })
            
            it('responds with 200 and the specified student', () => {
                const studentId = 1
                return supertest(app)
                .get(`/api/students/${studentId}`)
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(200)
                .then(res => {
                    const resReformattedDate = {...res.body, birth_date: new Date(res.body.birth_date)}
                    expect(resReformattedDate).to.eql(testStudents[studentId-1])
                })
            })
        })
    })
    
    context(`Given an XSS attack student`, () => {
        const { maliciousStudent, expectedStudent } = makeMaliciousStudent()
        
        beforeEach('insert malicious article', () => {
            return db
            .into('student')
            .insert(maliciousStudent)
        })
        
        it('removes XSS attack content', () => {
            return supertest(app)
            .get(`/api/students/${maliciousStudent.student_id}`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .expect(200)
            .expect(res => {
                expect(res.body.first_name).to.eql(expectedStudent.first_name)
            })
        })
    })

      describe(`POST /api/students`, () => {
        it(`creates a student, responding with 201 and the new student`, () => {
          const newStudent = {
            first_name: 'Bob', 
            last_name: 'Bobberson', 
            birth_date: new Date('1982-11-14'),
          }
          return supertest(app)
            .post('/api/students')
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .send(newStudent)
            .expect(201)
            .expect(res => {
                const resBirthdate = new Date(res.body.birth_date)
              expect(res.body.first_name).to.eql(newStudent.first_name)
              expect(res.body.last_name).to.eql(newStudent.last_name)
              expect(resBirthdate).to.eql(newStudent.birth_date)
              expect(res.body).to.have.property('student_id')
              expect(res.headers.location).to.eql(`/api/students/${res.body.student_id}`)
            })
            .then(res =>
              supertest(app)
                .get(`/api/students/${res.body.student_id}`)
                .set('Authorization', `Bearer ${API_TOKEN}`)
                .expect(res.body)
            )
        })

        const requiredFields = ['first_name', 'last_name', 'birth_date']

        requiredFields.forEach(field => {
          const newStudent = {
            first_name: 'Testy',
            last_name: 'New Name',
            birth_date: '01-01-1980'
          }

          it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newStudent[field]

            return supertest(app)
              .post('/api/students')
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .send(newStudent)
              .expect(400, {
                error: { message: `Missing '${field}' in request body` }
              })
          })
        })

        it('removes XSS attack content from response', () => {
          const { maliciousStudent, expectedStudent } = makeMaliciousStudent()
          return supertest(app)
            .post(`/api/students`)
            .set('Authorization', `Bearer ${API_TOKEN}`)
            .send(maliciousStudent)
            .expect(201)
            .expect(res => {
              expect(res.body.first_name).to.eql(expectedStudent.first_name)
            })
        })
      })

      describe(`DELETE /api/students/:student_id`, () => {
        context(`Given no students`, () => {
          it(`responds with 404`, () => {
            const studentId = 123456
            return supertest(app)
              .delete(`/api/students/${studentId}`)
              .set('Authorization', `Bearer ${API_TOKEN}`)
              .expect(404, { error: { message: `Row from table: '${tableName}' doesn't exist`}})
          })
        })

    //CLOSING BRACKETS FOR FUNCTION
    //
    })
})

    //     context('Given there are students in the database', () => {
    //       const testStudents = makeStudentsArray();

    //       it('responds with 204 and removes the student', () => {
    //         const idToRemove = 2
    //         const expectedStudents = testStudents.filter(student => student.student_id !== idToRemove)
    //         return supertest(app)
    //           .delete(`/api/students/${idToRemove}`)
    //           .expect(204)
    //           .then(res =>
    //             supertest(app)
    //               .get(`/api/students`)
    //               .expect(expectedStudents)
    //           )
    //       })
    //     })
    //   })

    //   describe(`PATCH /api/students/:student_id`, () => {
    //     context(`Given no students`, () => {
    //       it(`responds with 404`, () => {
    //         const studentId = 123456
    //         return supertest(app)
    //           .delete(`/api/students/${studentId}`)
    //           .expect(404, { error: { message: `Student doesn't exist` } })
    //       })
    //     })

    //     context('Given there are students in the database', () => {
    //       const testStudents = makeStudentsArray();
    //       const testStudents = makeStudentssArray()

    //       beforeEach('insert students', () => {
    //         return db
    //           .into('student')
    //           .insert(testStudents)
    //       })

    //       it('responds with 204 and updates the student', () => {
    //         const idToUpdate = 2
    //         const updatedStudent = {
    //             first_name: 'New First Name',
    //             last_name: 'New Last Name',
    //             birth_date: '01-01-1900'
    //         }
    //         const expectedStudent = {
    //           ...testStudent[idToUpdate - 1],
    //           ...updatedStudent
    //         }
    //         return supertest(app)
    //           .patch(`/api/students/${idToUpdate}`)
    //           .send(updatedStudent)
    //           .expect(204)
    //           .then(res =>
    //             supertest(app)
    //               .get(`/api/students/${idToUpdate}`)
    //               .expect(expectedStudent)
    //           )
    //       })

    //       it(`responds with 400 when no required fields supplied`, () => {
    //         const idToUpdate = 2
    //         return supertest(app)
    //           .patch(`/api/students/${idToUpdate}`)
    //           .send({ irrelevantField: 'foo' })
    //           .expect(400, {
    //             error: {
    //               message: `Request body must content either 'first_name', 'last_name' or 'birth_date'`
    //             }
    //           })
    //       })

    //       it(`responds with 204 when updating only a subset of fields`, () => {
    //         const idToUpdate = 2
    //         const updatedStudent = {
    //             last_name: 'new last name',
    //         }
    //         const expectedStudent = {
    //             ...testStudent[idToUpdate - 1],
    //             ...updatedStudent
    //           }

    //         return supertest(app)
    //           .patch(`/api/studentss/${idToUpdate}`)
    //           .send({
    //             ...updatedStudent,
    //             fieldToIgnore: 'should not be in GET response'
    //           })
    //           .expect(204)
    //           .then(res =>
    //             supertest(app)
    //               .get(`/api/students/${idToUpdate}`)
    //               .expect(expectedStudent)
    //           )
    //       })
    //     })
    //   })
    // })
