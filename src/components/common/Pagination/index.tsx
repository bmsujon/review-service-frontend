import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => onPageChange(page)}
      className={`px-4 py-2 rounded-md ${
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      {page + 1}
    </button>
  );

  const renderEllipsis = () => (
    <span className="px-4 py-2 text-gray-500">...</span>
  );

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return pages;
    }

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), null, ...pages.slice(-1)];
    }

    if (currentPage >= totalPages - 4) {
      return [...pages.slice(0, 1), null, ...pages.slice(-5)];
    }

    return [
      ...pages.slice(0, 1),
      null,
      ...pages.slice(currentPage - 1, currentPage + 2),
      null,
      ...pages.slice(-1),
    ];
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>

      {getVisiblePages().map((page) =>
        page === null ? renderEllipsis() : renderPageButton(page)
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 