import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Pagination = ({ totalScreens = 8 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination pagination-sm justify-content-center">
        {[...Array(totalScreens).keys()].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <li
              key={pageNumber}
              className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
            >
              <a
                className="page-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(pageNumber);
                }}
              >
                {pageNumber}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
