const knex = require("knex");
const app = require("../src/app");
const {
  makeParentTableStudentRows,
  makeGrandparentTableCommunityRows,
  makeParentTableSubcommunityRows,
  makeTestRows,
  makeTestRow,
} = require("./student-subcommunities.fixtures");
const logger = require("../src/logger");
const API_TOKEN = process.env.API_TOKEN;

const table = {
  name: "student_subcommunity",
  parentTableStudent: "student",
  parentTableSubcommunity: "subcommunity",
  grandparentTableCommunity: "community",
  endpoint: "student-subcommunities",
  columns: ["subcommunity_id", "student_id"],
  updatedColumn: {
    subcommunity_id: 4,
  },
  rowId: "student_subcommunity_id",
};

const reformatTemplate = {
  row_id: "student_subcommunity_id",
};

const reformatRow = (row) => {
  let reformattedRow = {};
  Object.keys(row).forEach((key) => {
    switch (key) {
      case reformatTemplate.date:
        reformattedRow[key] = new Date(row[key]);
        break;

      case reformatTemplate.money:
        reformattedRow[key] = parseInt(row[key]);
        break;

      default:
        reformattedRow[key] = row[key];
    }
  });
  return reformattedRow;
};

describe(`${table.name} endpoints`, function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw(`TRUNCATE table ${table.name} RESTART IDENTITY CASCADE`)
  );
  before("clean the parent table, student", () =>
    db.raw(
      `TRUNCATE table ${table.parentTableStudent} RESTART IDENTITY CASCADE`
    )
  );
  before("clean the parent table, subcommunity", () =>
    db.raw(
      `TRUNCATE table ${table.parentTableSubcommunity} RESTART IDENTITY CASCADE`
    )
  );
  before("clean the grandparent table, community", () =>
    db.raw(
      `TRUNCATE table ${table.grandparentTableCommunity} RESTART IDENTITY CASCADE`
    )
  );

  afterEach("cleanup", () =>
    db.raw(`TRUNCATE table ${table.name} RESTART IDENTITY CASCADE`)
  );
  afterEach("cleanup parent table, student", () =>
    db.raw(
      `TRUNCATE table ${table.parentTableStudent} RESTART IDENTITY CASCADE`
    )
  );
  afterEach("cleanup parent table, subcommunity", () =>
    db.raw(
      `TRUNCATE table ${table.parentTableSubcommunity} RESTART IDENTITY CASCADE`
    )
  );
  afterEach("cleanup parent table, community", () =>
    db.raw(
      `TRUNCATE table ${table.grandparentTableCommunity} RESTART IDENTITY CASCADE`
    )
  );

  describe(`GET /api/${table.endpoint}`, () => {
    context(`Given no rows in table ${table.name}`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/api/${table.endpoint}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(200, []);
      });
    });
  });

  context(`Given there are rows in table ${table.name} in the database`, () => {
    const testRows = makeTestRows();
    const parentTableStudentRows = makeParentTableStudentRows();
    const parentTableSubcommunityRows = makeParentTableSubcommunityRows();
    const grandparentTableCommunityRows = makeGrandparentTableCommunityRows();
    beforeEach("insert rows", () => {
      return db
        .into(table.parentTableStudent)
        .insert(parentTableStudentRows)
        .then(() => {
          return db
            .into(table.grandparentTableCommunity)
            .insert(grandparentTableCommunityRows);
        })
        .then(() => {
          return db
            .into(table.parentTableSubcommunity)
            .insert(parentTableSubcommunityRows);
        })
        .then(() => {
          return db.into(table.name).insert(testRows);
        });
    });
    it("responds with 200 and all of the rows", () => {
      return supertest(app)
        .get(`/api/${table.endpoint}`)
        .set("Authorization", `Bearer ${API_TOKEN}`)
        .expect(200)
        .then((res) => {
          const reformattedRows = res.body.map((row) => {
            return reformatRow(row);
          });
          expect(testRows).to.eql(reformattedRows);
        });
    });
  });

  // context(`Given an XSS attack`, () => {
  //   const { maliciousRow, expectedRow } = makeMaliciousRow();
  //   const parentTableStudentRows = makeParentTableStudentRows();
  //   const parentTableSubcommunityeRows = makeParentTableSubcommunityRows();
  //   beforeEach("insert rows", () => {
  //     return db
  //       .into(table.parentTableStudent)
  //       .insert(parentTableStudentRows)
  //       .then(() => {
  //         return db
  //           .into(table.parentTableSubcommunity)
  //           .insert(parentTableSubcommunityRows);
  //       })
  //       .then(() => {
  //         return db.into(table.name).insert(maliciousRow);
  //       });
  //   });

  //   it("removes XSS attack content", () => {
  //     return supertest(app)
  //       .get(`/api/${table.endpoint}`)
  //       .set("Authorization", `Bearer ${API_TOKEN}`)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body[0][table.xssColumn]).to.eql(
  //           expectedRow[table.xssColumn]
  //         );
  //       });
  //   });
  //});

  describe(`GET /api/${table.endpoint}/:rowId`, () => {
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        const rowId = 123456;
        return supertest(app)
          .get(`/api/${table.endpoint}/${rowId}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(404, {
            error: { message: `Row from table: '${table.name}' doesn't exist` },
          });
      });
    });

    context("Given there are rows in the database", () => {
      const testRows = makeTestRows();
      const parentTableStudentRows = makeParentTableStudentRows();
      const parentTableSubcommunityRows = makeParentTableSubcommunityRows();
      const grandparentTableCommunityRows = makeGrandparentTableCommunityRows();
      beforeEach("insert rows", () => {
        return db
          .into(table.parentTableStudent)
          .insert(parentTableStudentRows)
          .then(() => {
            return db
              .into(table.grandparentTableCommunity)
              .insert(grandparentTableCommunityRows);
          })
          .then(() => {
            return db
              .into(table.parentTableSubcommunity)
              .insert(parentTableSubcommunityRows);
          })
          .then(() => {
            return db.into(table.name).insert(testRows);
          });
      });
      it("responds with 200 and the specified row", () => {
        const rowId = 1;
        return supertest(app)
          .get(`/api/${table.endpoint}/${rowId}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(200)
          .then((res) => {
            const reformattedRow = reformatRow(res.body);
            expect(reformattedRow).to.eql(testRows[rowId - 1]);
          });
      });
    });
  });

  // context(`Given an XSS attack row`, () => {
  //   const { maliciousRow, expectedRow } = makeMaliciousRow();
  //   const parentTableStudentRows = makeParentTableStudentRows();
  //   const parentTableSubcommunityRows = makeParentTableSubcommunityRows();
  //   beforeEach("insert rows", () => {
  //     return db
  //       .into(table.parentTableStudent)
  //       .insert(parentTableStudentRows)
  //       .then(() => {
  //         return db
  //           .into(table.parentTableChallenge)
  //           .insert(parentTableSubcommunityRows);
  //       })
  //       .then(() => {
  //         return db.into(table.name).insert(maliciousRow);
  //       });
  //   });
  //   it("removes XSS attack content", () => {
  //     return supertest(app)
  //       .get(`/api/${table.endpoint}/${maliciousRow[table.rowId]}`)
  //       .set("Authorization", `Bearer ${API_TOKEN}`)
  //       .expect(200)
  //       .expect((res) => {
  //         expect(res.body[table.xssColumn]).to.eql(
  //           expectedRow[table.xssColumn]
  //         );
  //       });
  //   });
  // });

  describe(`POST /api/${table.endpoint}`, () => {
    const parentTableStudentRows = makeParentTableStudentRows();
    const parentTableSubcommunityRows = makeParentTableSubcommunityRows();
    const grandparentTableCommunityRows = makeGrandparentTableCommunityRows();
    beforeEach("insert rows", () => {
      return db
        .into(table.parentTableStudent)
        .insert(parentTableStudentRows)
        .then(() => {
          return db
            .into(table.grandparentTableCommunity)
            .insert(grandparentTableCommunityRows);
        })
        .then(() => {
          return db
            .into(table.parentTableSubcommunity)
            .insert(parentTableSubcommunityRows);
        });
    });
    const newRow = makeTestRow();
    it(`creates a row, responding with 201 and the new row`, () => {
      return supertest(app)
        .post(`/api/${table.endpoint}`)
        .set("Authorization", `Bearer ${API_TOKEN}`)
        .send(newRow)
        .expect(201)
        .expect((res) => {
          const reformattedRow = reformatRow(res.body);
          expect(reformattedRow).to.eql(newRow);
          expect(res.body).to.have.property(`${table.rowId}`);
          expect(res.headers.location).to.eql(
            `/api/${table.endpoint}/${res.body[table.rowId]}`
          );
        })
        .then((res) =>
          supertest(app)
            .get(`/api/${table.endpoint}/${res.body[table.rowId]}`)
            .set("Authorization", `Bearer ${API_TOKEN}`)
            .expect(res.body)
        );
    });
    table.columns.forEach((field) => {
      const newRow = makeTestRow();
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newRow[field];
        return supertest(app)
          .post(`/api/${table.endpoint}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .send(newRow)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
    // it("removes XSS attack content from response", () => {
    //   const { maliciousRow, expectedRow } = makeMaliciousRow();
    //   return supertest(app)
    //     .post(`/api/${table.endpoint}`)
    //     .set("Authorization", `Bearer ${API_TOKEN}`)
    //     .send(maliciousRow)
    //     .expect(201)
    //     .expect((res) => {
    //       expect(res.body.first_name).to.eql(expectedRow.first_name);
    //     });
    // });
  });

  describe(`DELETE /api/${table.name}/:rowId`, () => {
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        const testRowId = 123456;
        return supertest(app)
          .delete(`/api/${table.endpoint}/${testRowId}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(404, {
            error: { message: `Row from table: '${table.name}' doesn't exist` },
          });
      });
    });
    context("Given there are rows in table", () => {
      const testRows = makeTestRows();
      const parentTableStudentRows = makeParentTableStudentRows();
      const parentTableSubcommunityRows = makeParentTableSubcommunityRows();
      const grandparentTableCommunityRows = makeGrandparentTableCommunityRows();
      beforeEach("insert rows", () => {
        return db
          .into(table.parentTableStudent)
          .insert(parentTableStudentRows)
          .then(() => {
            return db
              .into(table.grandparentTableCommunity)
              .insert(grandparentTableCommunityRows);
          })
          .then(() => {
            return db
              .into(table.parentTableSubcommunity)
              .insert(parentTableSubcommunityRows);
          })
          .then(() => {
            return db.into(table.name).insert(testRows);
          });
      });
      it("responds with 204 and removes the row", () => {
        const idToRemove = 1;
        return supertest(app)
          .delete(`/api/${table.endpoint}/${idToRemove}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(204)
          .then((res) => {
            const expectedRows = testRows.filter(
              (row) => row[table.rowId] !== idToRemove
            );
            supertest(app).get(`/api/${table.endpoint}`).expect(expectedRows);
          });
      });
    });
  });

  describe(`PATCH /api/${table.endpoint}/:rowId`, () => {
    context(`Given no rows`, () => {
      it(`responds with 404`, () => {
        const rowId = 123456;
        return supertest(app)
          .patch(`/api/${table.endpoint}/${rowId}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(404, {
            error: { message: `Row from table: '${table.name}' doesn't exist` },
          });
      });
    });
    context("Given there are rows in the database", () => {
      const testRows = makeTestRows();
      const parentTableStudentRows = makeParentTableStudentRows();
      const parentTableSubcommunityRows = makeParentTableSubcommunityRows();
      const grandparentTableCommunityRows = makeGrandparentTableCommunityRows();
      beforeEach("insert rows", () => {
        return db
          .into(table.parentTableStudent)
          .insert(parentTableStudentRows)
          .then(() => {
            return db
              .into(table.grandparentTableCommunity)
              .insert(grandparentTableCommunityRows);
          })
          .then(() => {
            return db
              .into(table.parentTableSubcommunity)
              .insert(parentTableSubcommunityRows);
          })
          .then(() => {
            return db.into(table.name).insert(testRows);
          });
      });
      it("responds with 204 and updates the row", () => {
        const idToUpdate = 1;
        const updatedRow = makeTestRow();
        const expectedRow = {
          ...testRows[idToUpdate - 1],
          ...updatedRow,
        };
        return supertest(app)
          .patch(`/api/${table.endpoint}/${idToUpdate}`)
          .send(updatedRow)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/${table.endpoint}/${idToUpdate}`)
              .set("Authorization", `Bearer ${API_TOKEN}`)
              .then((res) => {
                expect(expectedRow).to.eql(res.body);
              });
          });
      });
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/${table.endpoint}/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .expect(400, {
            error: {
              message: `Request body content must contain at least one of the following: ${table.columns}`,
            },
          });
      });
      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;

        const expectedRow = {
          ...testRows[idToUpdate - 1],
          ...table.updatedColumn,
        };
        return supertest(app)
          .patch(`/api/${table.endpoint}/${idToUpdate}`)
          .set("Authorization", `Bearer ${API_TOKEN}`)
          .send({
            ...table.updatedColumn,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/${table.endpoint}/${idToUpdate}`)
              .set("Authorization", `Bearer ${API_TOKEN}`)
              .then((res) => {
                const reformattedRow = reformatRow(res.body);
                expect(reformattedRow).to.eql(expectedRow);
              })
          );
      });
    });
  });
});
