function makeParentTableRows() {
  return [
    {
      first_name: "Mike",
      last_name: "Cermak",
      birth_date: new Date("01-01-1980"),
      student_id: 1,
    },
    {
      first_name: "Ale",
      last_name: "Cabrera-Mondragon",
      birth_date: new Date("02-02-1990"),
      student_id: 2,
    },
  ];
}

function makeTestRows() {
  return [
    {
      exchange_id: 1,
      student_id: 2,
      exchange_date: new Date("01-01-2000"),
      amount: 1.0,
      note: "Exchange 1",
    },
    {
      exchange_id: 2,
      student_id: 2,
      exchange_date: new Date("01-02-2000"),
      amount: 2.0,
      note: "Exchange 2",
    },
    {
      exchange_id: 3,
      student_id: 1,
      exchange_date: new Date("01-03-2000"),
      amount: 3.0,
      note: "Exchange 2",
    },
  ];
}

function makeTestRow() {
  return {
    exchange_id: 1,
    student_id: 1,
    exchange_date: new Date("01-03-2000"),
    amount: 3.0,
    note: "Exchange 2",
  };
}

function makeMaliciousRow() {
  const maliciousRow = {
    exchange_id: 4,
    student_id: 1,
    exchange_date: "01-03-2000",
    amount: 3.0,
    note: 'Exchange 2 XSS <script>alert("xss");</script>',
  };
  const expectedRow = {
    ...maliciousRow,
    note: 'Exchange 2 XSS &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousRow,
    expectedRow,
  };
}

module.exports = {
  makeParentTableRows,
  makeTestRows,
  makeTestRow,
  makeMaliciousRow,
};
