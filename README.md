# LeetCode Contest Tracker

> **WARNING**: This entire repository was completely vibecoded. Proceed with caution.

An elegant, barebones tracker inspired by AtCoder Kenkoooo that visualizes your LeetCode contest progress using [Zerotrac's difficulty ratings](https://github.com/zerotrac/leetcode_problem_rating).

## Live Website
Check out the live tracker here: **[Insert Your GitHub Pages Link Here]**

*(The website automatically updates itself twice a week: on Sunday evenings to fetch the newest problems, and on Thursdays to lock in their finalized official difficulty ratings!)*

---
---

## Chrome Extension (Auto-Sync)
To sync your solved problems into the tracker without copying/pasting, install the included Chrome Extension. It securely fetches your progress from LeetCode's GraphQL API and injects it directly into the tracker.

### How to Install
1. Download or clone this repository.
2. Open Google Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** in the top right corner.
4. Click **Load unpacked** in the top left corner.
5. Select the `extension` folder located inside this repository.

### How to Use
1. Log into your account on [LeetCode.com](https://leetcode.com).
2. Open the tab where your **LeetCode Contest Tracker** is hosted (e.g., your GitHub Pages URL or `localhost`).
3. Click the **LeetCode Sync** extension icon in your browser toolbar.
4. Click the **Copy My Progress** button.
5. Watch the magic happen! The extension will parse all 3500+ LeetCode problems, sync your progress to the website's memory, and reload the page to display your lit-up green cells.

---

## Development
To run this project locally:
```bash
npm install
npm run dev
```
