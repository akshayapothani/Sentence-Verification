

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const ProgressBar = ({ progressPercentage }) => {
  return (
    <div className="progress-bar-container display d-flex col-10">
      <div className="progress display d-flex col-10">
        <div
          className="progress-bar progress-bar-striped"
          role="progressbar"
          style={{ width: `${progressPercentage}%` }}
          aria-valuenow={progressPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

