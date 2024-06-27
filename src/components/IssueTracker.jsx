import React from 'react';
import IssueList from './IssueList';
import AddTag from './AddTag';

const IssueTracker = () => {

  return (
    <div className="IssueTracker-container">      
      <IssueList/>
      <AddTag />
    </div>
  );
};

export default IssueTracker;
