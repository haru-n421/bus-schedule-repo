import React from 'react';

function SchedulePager({ onPageChange, currentPage, hasNextPage, hasPrevPage }) {
  return (
    <div className="schedule-pager">
      <button 
        className="pager-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
      >
        &lt; 前の時刻
      </button>
      <span id="page-info">
        {currentPage + 1}ページ目
      </span>
      <button 
        className="pager-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        次の時刻 &gt;
      </button>
    </div>
  );
}

export default SchedulePager;
