import React from 'react';

export default function NoRecordsAlert() {
  return (
    <div className="alert alert-info text-center w-50 mx-auto mt-5" role="alert">
      <span className="font-weight-bold">No records found!</span>
      <br />
      Use the form on the left to begin a new search.
    </div>
  );
}
