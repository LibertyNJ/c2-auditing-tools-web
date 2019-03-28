import React from 'react';

function Providers() {
  return (
    <main className="container-fluid overflow-auto">
      <h2>Users</h2>
      <Filters />
      <Table />
    </main>
  );
}

function Filters() {
  return (
    <form>
      <input />
    </form>
  );
}

function Table() {
  return (
    <table className="table">
      <caption>List of users</caption>
      <thead>
        <tr>
          <th scope="col">Last name</th>
          <th scope="col">First name</th>
          <th scope="col">Pyxis ID</th>
          <th scope="col">Sunrise ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Last</td>
          <td>First</td>
          <td>Pyxisid</td>
          <td>Sunriseid</td>
        </tr>
        <tr>
          <td>Last</td>
          <td>First</td>
          <td>Pyxisid</td>
          <td>Sunriseid</td>
        </tr>
        <tr>
          <td>Last</td>
          <td>First</td>
          <td>Pyxisid</td>
          <td>Sunriseid</td>
        </tr>
        <tr>
          <td>Last</td>
          <td>First</td>
          <td>Pyxisid</td>
          <td>Sunriseid</td>
        </tr>
        <tr>
          <td>Last</td>
          <td>First</td>
          <td>Pyxisid</td>
          <td>Sunriseid</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Providers;
