import React from 'react';
import IssueList from './IssueList';
import AddTag from './AddTag';

const IssueTracker = () => {
  const handleAddTag = () => {
    // Lógica para agregar un nuevo tag
    console.log('Agregar nuevo tag');
  };

  return (
    <div className="IssueTracker-container">
      <h1 className="text-center">Issue Tracker</h1>
      <IssueList/>
      <AddTag onClick={handleAddTag} />
    </div>
  );
};

export default IssueTracker;
