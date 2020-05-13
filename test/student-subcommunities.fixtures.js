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

function makeGrandparentTableCommunityRows() {
  return [
    {
      community_name: "Green Dragons",
      community_id: 1,
    },
    {
      community_name: "Sprouts",
      community_id: 2,
    },
  ];
}

function makeParentTableSubcommunityRows() {
  return [
    {
      community_id: 1,
      subcommunity_id: 1,
      subcommunity_name: "Green Dragons 1",
    },
    {
      community_id: 1,
      subcommunity_id: 2,
      subcommunity_name: "Green Dragons 2",
    },
    {
      community_id: 2,
      subcommunity_id: 3,
      subcommunity_name: "Sprouts 1",
    },
    {
      community_id: 2,
      subcommunity_id: 4,
      subcommunity_name: "Sprouts 2",
    },
  ];
}

function makeTestRows() {
  return [
    {
      student_subcommunity_id: 1,
      student_id: 1,
      subcommunity_id: 1,
    },
    {
      student_subcommunity_id: 2,
      student_id: 1,
      subcommunity_id: 2,
    },
    {
      student_subcommunity_id: 3,
      student_id: 2,
      subcommunity_id: 3,
    },
    {
      student_subcommunity_id: 4,
      student_id: 2,
      subcommunity_id: 4,
    },
  ];
}

function makeTestRow() {
  return {
    student_subcommunity_id: 1,
    student_id: 1,
    subcommunity_id: 2,
  };
}

module.exports = {
  makeParentTableStudentRows,
  makeGrandparentTableCommunityRows,
  makeParentTableSubcommunityRows,
  makeTestRows,
  makeTestRow,
};
