const path = require("path");
const express = require("express");
const xss = require("xss");
const endpointService = require("./service");
const logger = require("../logger");

const endpointRouter = express.Router();
const jsonParser = express.json();

const serializeRow = (row) => ({
  challenge_entry_id: row.challenge_entry_id,
  challenge_id: row.challenge_id,
  student_id: row.student_id,
  record: row.record,
  entry_date: xss(row.entry_date),
  notes: xss(row.notes),
});

const table = {
  name: "challenge_entry",
  columns: ["challenge_id", "student_id", "record", "entry_date", "notes"],
  rowId: "challenge_entry_id",
};

endpointRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRows(knexInstance)
      .then((rows) => {
        res.json(rows.map(serializeRow));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      challenge_entry_id,
      challenge_id,
      student_id,
      record,
      entry_date,
      notes,
    } = req.body;
    const newRow = {
      challenge_entry_id,
      challenge_id,
      student_id,
      record,
      entry_date,
      notes,
    };

    for (const [key, value] of Object.entries(newRow))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    endpointService
      .insertRow(req.app.get("db"), newRow)
      .then((row) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${row[table.rowId]}`))
          .json(serializeRow(row));
      })
      .catch(next);
  });

endpointRouter
  .route("/:row_id")
  .all((req, res, next) => {
    endpointService
      .getById(req.app.get("db"), req.params.row_id)
      .then((row) => {
        if (!row) {
          return res.status(404).json({
            error: { message: `Row from table: '${table.name}' doesn't exist` },
          });
        }
        res.row = row;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeRow(res.row));
  })
  .delete((req, res, next) => {
    endpointService
      .deleteRow(req.app.get("db"), req.params.row_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    //REWRITE, use table's column names
    const {
      challenge_entry_id,
      challenge_id,
      student_id,
      record,
      entry_date,
      notes,
    } = req.body;
    const rowToUpdate = {
      challenge_entry_id,
      challenge_id,
      student_id,
      record,
      entry_date,
      notes,
    };

    const numberOfValues = Object.values(rowToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body content must contain at least one of the following: ${table.columns}`,
        },
      });

    endpointService
      .updateRow(req.app.get("db"), req.params.row_id, rowToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });
endpointRouter
  .route(`/students/:student_id/challenges/:challenge_id`)
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRowsMatchingStudentAndChallenge(
        knexInstance,
        req.params.student_id,
        req.params.challenge_id
      )
      .then((rows) => {
        res.json(rows.map(serializeRow));
      })
      .catch(next);
  });
endpointRouter.route(`/students/:student_id`).get((req, res, next) => {
  const knexInstance = req.app.get("db");
  endpointService
    .getAllRowsMatchingStudent(knexInstance, req.params.student_id)
    .then((rows) => {
      res.json(rows.map(serializeRow));
    })
    .catch(next);
});

module.exports = endpointRouter;
