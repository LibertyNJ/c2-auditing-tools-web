import React from 'react';

function Administrations() {
  return (
    <main className="container-fluid overflow-auto">
      <h2>Administrations</h2>
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
      <caption>Pyxis transactions</caption>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">User</th>
          <th scope="col">Medication</th>
          <th scope="col">Strength</th>
          <th scope="col">MRN</th>
          <th scope="col">Order ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Administrations;
