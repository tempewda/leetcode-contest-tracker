import fs from 'fs';
import path from 'path';

async function fetchRatings() {
  console.log("Fetching ratings from Zerotrac...");
  const response = await fetch('https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/main/data.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const rawData = await response.json();
  
  console.log(`Fetched ${rawData.length} problems.`);
  
  // Example of rawData item:
  // {
  //   "Rating": 1450.45,
  //   "ID": 2000,
  //   "Title": "Example Title",
  //   "Title ZH": "...",
  //   "Title Slug": "example-title",
  //   "Contest ID_en": "Weekly Contest 300",
  //   "Contest ID_zh": "...",
  //   "ProblemIndex": "Q1"
  // }
  
  // We need to group them by contest.
  const contestsMap = new Map();
  
  for (const prob of rawData) {
    const contestName = prob["ContestID_en"];
    if (!contestName || contestName === "") continue; // Skip non-contest problems
    
    if (!contestsMap.has(contestName)) {
      contestsMap.set(contestName, []);
    }
    
    // Determine the color based on rating (Zerotrac uses similar bands to AtCoder)
    // Gray: < 1200
    // Brown: 1200 - 1399
    // Green: 1400 - 1599
    // Cyan: 1600 - 1999
    // Blue: 2000 - 2399
    // Yellow: 2400 - 2799
    // Orange: 2800 - 2999
    // Red: >= 3000
    // (We will just save the rating, UI will handle coloring)
    
    contestsMap.get(contestName).push({
      id: prob["ID"],
      title: prob["Title"],
      slug: prob["TitleSlug"],
      rating: Math.round(prob["Rating"]),
      index: prob["ProblemIndex"]
    });
  }
  
  const formattedData = [];
  
  // Sort contests chronologically by using the max problem ID as a proxy for time
  const contestNames = Array.from(contestsMap.keys());
  
  contestNames.sort((a, b) => {
    const maxIdA = Math.max(...contestsMap.get(a).map(p => p.id));
    const maxIdB = Math.max(...contestsMap.get(b).map(p => p.id));
    return maxIdB - maxIdA; // Descending (most recent first)
  });
  
  for (const name of contestNames) {
    const problems = contestsMap.get(name);
    // Sort problems by index (Q1, Q2, Q3, Q4)
    problems.sort((a, b) => a.index.localeCompare(b.index));
    
    formattedData.push({
      contest: name,
      problems: problems
    });
  }
  
  // Write to src/data.json
  const outputPath = path.join(process.cwd(), 'src', 'data.json');
  fs.writeFileSync(outputPath, JSON.stringify(formattedData, null, 2));
  console.log(`Successfully wrote ${formattedData.length} contests to src/data.json`);
}

fetchRatings().catch(console.error);
