import React from 'react';

function Dashboard() {
  return (
    <main className="container-fluid overflow-auto">
      <h2>Dashboard</h2>
      <SummaryDashboard />
      <BalanceDashboard />
    </main>
  );
}

function BalanceDashboard() {
  return (
    <section>
      <h3>Top Ten Balances</h3>
      <table className="table table-striped table-bordered table-hover table-sm">
        <caption>Top ten users with outstanding balances</caption>
        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Medication</th>
            <th scope="col">Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <th scope="row">Username</th>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function SummaryDashboard() {
  return (
    <section>
      <h3>Summary</h3>
      <table className="table table-bordered table-sm">
        <caption>Summary of C2 activity</caption>
        <thead>
          <tr>
            <th scope="col">Total doses adminstered</th>
            <th scope="col">Total undocumented</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#</td>
            <td>#</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default Dashboard;
