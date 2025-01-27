import React, { useState } from 'react';
import IssueList from './IssueList';

const IssueTracker = () => {
  const [shouldRefreshTags] = useState(false);

  return (
    <div className="IssueTracker-container">      
      <IssueList refreshTrigger={shouldRefreshTags} />
    </div>
  );
};

export default IssueTracker;