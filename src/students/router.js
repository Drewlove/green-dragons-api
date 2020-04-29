const path = require('path')
const express = require('express')
const xss = require('xss')
const endpointService = require('./service')
const logger = require('../logger')

const endpointRouter = express.Router()
const jsonParser = express.json()

//REWRITE, include each row from table 
const serializeRow = row => ({
  student_id: row.student_id,
  first_name: xss(row.first_name),
  last_name: xss(row.last_name),
  birth_date: xss(row.birth_date), 
})

const table = {
  name: 'student', 
  columns: ['first_name', 'last_name', 'birth_date']
}

endpointRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    endpointService.getAllRows(knexInstance)
      .then(rows => {
        res.json(rows.map(serializeRow))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { first_name, last_name, birth_date } = req.body
    const newRow = { first_name, last_name, birth_date }

    for (const [key, value] of Object.entries(newRow))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })  

    endpointService.insertRow(
      req.app.get('db'),
      newRow
    )
      .then(row => {
        res
          .status(201)
          //REWRITE, row.student_id to column name of row's id
          .location(path.posix.join(req.originalUrl, `/${row.student_id}`))
          .json(serializeRow(row))
      })
      .catch(next)
  })

endpointRouter
  .route('/:row_id')
  .all((req, res, next) => {
    endpointService.getById(
      req.app.get('db'),
      req.params.row_id
    )
      .then(row => {
        if (!row) {
          return res.status(404).json({
            error: { message: `Row from table: '${table.name}' doesn't exist`}
          })
        }
        res.row = row
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeRow(res.row))
  })
  .delete((req, res, next) => {
    endpointService.deleteRow(
      req.app.get('db'),
      req.params.row_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    //REWRITE, use table's column names
    const {first_name, last_name, birth_date} = req.body
    const rowToUpdate = {first_name, last_name, birth_date }

    //REWRITE, error.message to include column names that would be included in an update
    const numberOfValues = Object.values(rowToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body content must contain at least one of the following: ${table.columns}`
        }
      })

    endpointService.updateRow(
      req.app.get('db'),
      req.params.row_id,
      rowToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = endpointRouter