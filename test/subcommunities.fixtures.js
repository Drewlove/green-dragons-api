function makeParentTableRows() {
  return [     
    {
      community_id: 1,
      community_name: 'Community One',
    },
    {
      community_id: 2,
      community_name: 'Community Two',
    }
  ]
}

function makeTestRows() {
    return [     
      {
        subcommunity_id: 1,
        community_id: 1,
        subcommunity_name: 'Community One',
      },
      {
        subcommunity_id: 2,
        community_id: 2,
        subcommunity_name: 'Community Two',
      }
    ]
  }

  function makeTestRow(){
    return {
      subcommunity_id: 3,
      community_id: 2,
      subcommunity_name: 'Community Test',
    }
  }
  
  function makeMaliciousRow() {
  const maliciousRow = {
    subcommunity_id: 1,
    community_id: 2,
    subcommunity_name: 'Community One XSS <script>alert("xss");</script>',
  }
  const expectedRow = {
    ...maliciousRow,
    subcommunity_name: 'Community One XSS &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
  }
  return {
    maliciousRow,
    expectedRow,
  }
}
  
  module.exports = {
    makeParentTableRows,
    makeTestRows,
    makeTestRow,
    makeMaliciousRow
  }
