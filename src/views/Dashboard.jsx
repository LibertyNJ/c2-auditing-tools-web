import React from 'react';

function Dashboard() {
  return (
    <main>
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
      <table>
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
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>Medication</td>
            <td>Balance</td>
          </tr>
          <tr>
            <td>Username</td>
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
      <table>
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
