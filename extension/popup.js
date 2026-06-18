document.getElementById('fetchBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.innerText = "Connecting to LeetCode...";

  try {
    const cookie = await chrome.cookies.get({ url: 'https://leetcode.com', name: 'csrftoken' });
    if (!cookie) {
      throw new Error("Not logged in!\nPlease log in to LeetCode in another tab first.");
    }
    const csrfToken = cookie.value;

    let skip = 0;
    const limit = 100;
    let total = 100; 
    const payload = {};

    while (skip < total) {
      statusDiv.innerText = `Fetching... ${skip} / ${total > 100 ? total : '?'}`;
      
      const query = `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              titleSlug
              status
            }
          }
        }
      `;

      const variables = { categorySlug: "", skip, limit, filters: {} };

      const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": csrfToken
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      total = data.data.problemsetQuestionList.total;
      const questions = data.data.problemsetQuestionList.questions;
      
      for (let q of questions) {
        if (q.status === 'ac' || q.status === 'AC') {
          payload[q.titleSlug] = 'solved';
        } else if (q.status) {
          payload[q.titleSlug] = 'attempted';
        }
      }
      
      skip += limit;
    }
    
    const payloadStr = JSON.stringify(payload);
    const solvedCount = Object.values(payload).filter(x => x === 'solved').length;
    const attemptedCount = Object.values(payload).filter(x => x === 'attempted').length;

    // Try to auto-sync if the user is on the tracker tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && (tab.url.includes('localhost') || tab.url.includes('127.0.0.1') || tab.url.includes('github.io'))) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (dataStr) => {
            localStorage.setItem('leetcode-progress', dataStr); // Must match App.jsx exactly!
            window.location.reload();
          },
          args: [payloadStr]
        });
        statusDiv.innerText = `BOOM! Auto-Synced!\n\n${solvedCount} Solved\n${attemptedCount} Attempted\n\nThe page is reloading with your data.`;
        return; 
      } catch (e) {
        console.error("Auto-sync failed, falling back to clipboard", e);
      }
    }
    
    // Fallback: Copy to clipboard if not on the tracker tab
    try {
      await navigator.clipboard.writeText(payloadStr);
    } catch (e) {
      const textArea = document.createElement("textarea");
      textArea.value = payloadStr;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
    
    statusDiv.innerText = `Success!\n\n${solvedCount} Solved\n${attemptedCount} Attempted\n\nCopied to clipboard! Go to the tracker and paste it.`;
  } catch (err) {
    console.error(err);
    statusDiv.innerText = err.message || "An error occurred while fetching data.";
  }
});
