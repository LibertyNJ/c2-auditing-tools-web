import React from 'react';

function Balance() {
  return (
    <main className="container-fluid overflow-auto">
      <h2>Balance</h2>
      <Filters />
      <Table />
    </main>
  );
}

function Filters() {
  return (
    <form>
      <label
        for="user"
      >User</label>
      <input
        id="user"
        type="text"
      />
    </form>
  );
}

function Table() {
  return (
    <table className="table">
      <caption>Balance sheet</caption>
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Fentanyl</th>
          <th scope="col">Hydrocodone</th>
          <th scope="col">Hydromorphone</th>
          <th scope="col">Morphine</th>
          <th scope="col">Oxycodone</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Last, First</th>
          <td># mCg</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
        </tr>
        <tr>
          <th scope="row"> Last, First</th>
          <td># mCg</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
        </tr>
        <tr>
          <th scope="row">Last, First</th>
          <td># mCg</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
        </tr>
        <tr>
          <th scope="row">Last, First</th>
          <td># mCg</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
        </tr>
        <tr>
          <th scope="row">Last, First</th>
          <td># mCg</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
        </tr>
      </tbody >
      <tfoot>
        <tr>
          <th scope="row">Total</th>
          <td># mCg</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
          <td># mG</td>
        </tr>
      </tfoot>
    </table >
  );
}
export default Balance;
