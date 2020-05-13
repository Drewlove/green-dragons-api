function makeTestRows() {
  return [
    {
      first_name: "Ale",
      last_name: "Cabrera-Mondragon",
      birth_date: new Date("02-02-1990"),
      student_id: 1,
    },
    {
      first_name: "Mike",
      last_name: "Cermak",
      birth_date: new Date("01-01-1980"),
      student_id: 2,
    },
  ];
}

function makeMaliciousRow() {
  const maliciousRow = {
    first_name: 'Ale <script>alert("xss");</script>',
    last_name: "Cabrera-Mondragon",
    birth_date: new Date("1990-02-02"),
    student_id: 2,
  };
  const expectedRow = {
    ...maliciousRow,
    first_name: 'Ale &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousRow,
    expectedRow,
  };
}

module.exports = {
  makeTestRows,
  makeMaliciousRow,
};
