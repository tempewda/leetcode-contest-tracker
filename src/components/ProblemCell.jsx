import React from 'react';

export const getDifficultyInfo = (rating) => {
  if (rating < 1200) return { color: 'var(--rating-gray)', percentage: (rating / 1200) * 100 };
  if (rating < 1400) return { color: 'var(--rating-brown)', percentage: ((rating - 1200) / 200) * 100 };
  if (rating < 1600) return { color: 'var(--rating-green)', percentage: ((rating - 1400) / 200) * 100 };
  if (rating < 2000) return { color: 'var(--rating-cyan)', percentage: ((rating - 1600) / 400) * 100 };
  if (rating < 2400) return { color: 'var(--rating-blue)', percentage: ((rating - 2000) / 400) * 100 };
  if (rating < 2800) return { color: 'var(--rating-yellow)', percentage: ((rating - 2400) / 400) * 100 };
  if (rating < 3000) return { color: 'var(--rating-orange)', percentage: ((rating - 2800) / 200) * 100 };
  return { color: 'var(--rating-red)', percentage: 100 };
};

const ProblemCell = ({ problem, status }) => {
  if (!problem) {
    return <div className="problem-cell problem-cell-empty"></div>;
  }

  // status can be 'solved', 'attempted', or null
  const cellClass = `problem-cell ${status || ''}`;
  const { color, percentage } = getDifficultyInfo(problem.rating);

  // Floodfill circle style
  const circleStyle = {
    borderColor: color,
    background: `linear-gradient(to top, ${color} ${percentage}%, transparent ${percentage}%)`
  };

  return (
    <a 
      href={`https://leetcode.com/problems/${problem.slug}/`} 
      target="_blank" 
      rel="noreferrer"
      className={cellClass}
    >
      <div className="cell-top">
        <div className="diff-icon" style={circleStyle}></div>
        <span className="prob-title" style={{ color: color }}>{problem.id}. {problem.title}</span>
      </div>
      <div className="prob-rating">{problem.rating}</div>
    </a>
  );
};

export default ProblemCell;
