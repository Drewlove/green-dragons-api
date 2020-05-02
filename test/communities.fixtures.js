function makeTestRows() {
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

  function makeTestRow(){
    return {
      community_id: 3,
      community_name: 'Community Test',
    }
  }
  
  function makeMaliciousRow() {
  const maliciousRow = {
    community_id: 1,
    community_name: 'Community One XSS <script>alert("xss");</script>',
  }
  const expectedRow = {
    ...maliciousRow,
    community_name: 'Community One XSS &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
  }
  return {
    maliciousRow,
    expectedRow,
  }
}
  
  module.exports = {
    makeTestRows,
    makeTestRow,
    makeMaliciousRow
  }
