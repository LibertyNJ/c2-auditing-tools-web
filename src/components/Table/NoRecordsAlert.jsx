import React from 'react';

export default function NoRecordsAlert() {
  return (
    <div className="align-items-center d-flex h-100 w-100">
      <div className="alert alert-info text-center mx-auto" role="alert">
        <span className="font-weight-bold">No records found!</span> <br />
        Use the form above to begin a new search.
      </div>
    </div>
  );
}
