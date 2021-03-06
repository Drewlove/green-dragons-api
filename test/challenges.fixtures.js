function makeTestRows() {
  return [
    {
      challenge_id: 1,
      challenge_name: "Jump Rope",
      challenge_description: "How many times can you jump rope in 1 minute?",
      units: "jumps",
    },
    {
      challenge_id: 2,
      challenge_name: "Mile Run",
      challenge_description: "How fast can you run 1 mile?",
      units: "time",
    },
  ];
}

function makeTestRow() {
  return {
    challenge_id: 3,
    challenge_name: "Third Challenge",
    challenge_description: "Third description",
    units: "thirds",
  };
}

function makeMaliciousRow() {
  const maliciousRow = {
    challenge_id: 1,
    challenge_name: 'Jump Rope <script>alert("xss");</script>',
    challenge_description: "How many times can you jump rope in 1 minute?",
    units: "jumps",
  };
  const expectedRow = {
    ...maliciousRow,
    challenge_name: 'Jump Rope &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousRow,
    expectedRow,
  };
}

module.exports = {
  makeTestRows,
  makeTestRow,
  makeMaliciousRow,
};
