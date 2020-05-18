function makeParentTableStudentRows() {
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

function makeParentTableChallengeRows() {
  return [
    {
      challenge_name: "Archery Accuracy",
      challenge_description:
        "Score as many points as you can in 5 shots with the bow and arrow",
      units: "targets",
      challenge_id: 1,
    },
    {
      challenge_name: "1/2 Mile Run",
      challenge_description: "Run a 1/2 mile as fast as possible.",
      units: "seconds",
      challenge_id: 2,
    },
  ];
}

function makeTestRows() {
  return [
    {
      challenge_entry_id: 1,
      challenge_id: 1,
      student_id: 1,
      record: 20,
      entry_date: new Date("01-01-2000"),
      notes: "",
    },
    {
      challenge_entry_id: 2,
      challenge_id: 1,
      student_id: 1,
      record: 30,
      entry_date: new Date("01-02-2000"),
      notes: "",
    },
    {
      challenge_entry_id: 3,
      challenge_id: 1,
      student_id: 1,
      record: 40,
      entry_date: new Date("01-03-2000"),
      notes: "",
    },
  ];
}

function makeTestRow() {
  return {
    challenge_entry_id: 1,
    challenge_id: 1,
    student_id: 1,
    record: 40,
    entry_date: new Date("01-04-2000"),
    notes: "",
  };
}

function makeMaliciousRow() {
  const maliciousRow = {
    challenge_entry_id: 4,
    challenge_id: 1,
    student_id: 1,
    record: 40,
    entry_date: new Date("01-04-2000"),
    notes: 'Challenge entry XSS <script>alert("xss");</script>',
  };
  const expectedRow = {
    ...maliciousRow,
    notes: 'Challenge entry XSS &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousRow,
    expectedRow,
  };
}

module.exports = {
  makeParentTableStudentRows,
  makeParentTableChallengeRows,
  makeTestRows,
  makeTestRow,
  makeMaliciousRow,
};
