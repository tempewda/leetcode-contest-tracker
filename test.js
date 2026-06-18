fetch('https://leetcode.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'query{question(titleSlug:"check-if-the-rectangle-corner-is-reachable"){questionId questionFrontendId}}'
  })
}).then(r=>r.json()).then(console.log);
