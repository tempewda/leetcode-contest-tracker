import React from 'react';
import ProblemCell, { getDifficultyInfo } from './ProblemCell';
import data from '../data.json';

const formatContestName = (name) => {
  if (name.includes(' Contest ')) {
    const parts = name.split(' Contest ');
    return (
      <>
        {parts[0]}<br />
        <span style={{ whiteSpace: 'nowrap' }}>Contest {parts[1]}</span>
      </>
    );
  }
  return name;
};

const TableGrid = ({ userProgress }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Contest</th>
            <th>Q1</th>
            <th>Q2</th>
            <th>Q3</th>
            <th>Q4</th>
          </tr>
        </thead>
        <tbody>
          {data.map((contestGroup) => {
            // Find Q1, Q2, Q3, Q4
            const q1 = contestGroup.problems.find(p => p.index === 'Q1');
            const q2 = contestGroup.problems.find(p => p.index === 'Q2');
            const q3 = contestGroup.problems.find(p => p.index === 'Q3');
            const q4 = contestGroup.problems.find(p => p.index === 'Q4');

            const contestProblems = [q1, q2, q3, q4].filter(Boolean);
            const validRatings = contestProblems.map(p => p.rating).filter(r => r > 0);
            const avgRating = validRatings.length ? validRatings.reduce((a, b) => a + b, 0) / validRatings.length : 0;
            const { color, percentage } = getDifficultyInfo(avgRating);
            const circleStyle = {
              borderColor: color,
              background: `linear-gradient(to top, ${color} ${percentage}%, transparent ${percentage}%)`,
              flexShrink: 0,
              marginTop: '4px'
            };

            const probs = [q1, q2, q3, q4].map(p => ({
              problem: p,
              status: p ? (userProgress[p.slug] || null) : null
            }));

            const blocks = [];
            let currentBlock = { status: probs[0].status, items: [probs[0]] };

            for (let i = 1; i < 4; i++) {
              if (probs[i].status === currentBlock.status) {
                currentBlock.items.push(probs[i]);
              } else {
                blocks.push(currentBlock);
                currentBlock = { status: probs[i].status, items: [probs[i]] };
              }
            }
            blocks.push(currentBlock);

            return (
              <tr key={contestGroup.contest}>
                <td>
                  <a 
                    href={`https://leetcode.com/contest/${contestGroup.contest.toLowerCase().replace(/ /g, '-')}/`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="contest-link"
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div className="diff-icon" style={circleStyle}></div>
                      <div>{formatContestName(contestGroup.contest)}</div>
                    </div>
                  </a>
                </td>
                {blocks.map((block, idx) => (
                  <td 
                    key={idx} 
                    colSpan={block.items.length} 
                  >
                    <div className={`status-block ${block.status || 'unsolved'}`} style={{ 
                      display: 'grid', 
                      gridTemplateColumns: `repeat(${block.items.length}, minmax(0, 1fr))`,
                      height: '100%' 
                    }}>
                      {block.items.map((item, i) => (
                        <ProblemCell 
                          key={item.problem?.slug || `empty-${i}`} 
                          problem={item.problem} 
                          status={item.status} 
                        />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableGrid;
