import { ipcRenderer } from 'electron';
import React from 'react';

const DashboardView = () => (
  <React.Fragment>
    <div className="row flex-shrink-0">
      <header className="col">
        <h1 className="text-center">Dashboard</h1>
      </header>
    </div>
    <div className="row">
      <div className="col">
        <section>
          <header>
            <h2>Unassigned IDs</h2>
            <p>
              Assigning and maintaining IDs will give you more accurate results.
            </p>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>ADC IDs</th>
                  <th>EMAR IDs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#</td>
                  <td>#</td>
                </tr>
              </tbody>
            </table>
          </header>
        </section>
        <section>
          <header>
            <h2>Earliest and latest data imports</h2>
            <p>Earliest and latest dates for which data was imported.</p>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th />
                  <th>ADC</th>
                  <th>EMAR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Earliest</th>
                  <td>#</td>
                  <td>#</td>
                </tr>
                <tr>
                  <th>Latest</th>
                  <td>#</td>
                  <td>#</td>
                </tr>
              </tbody>
            </table>
          </header>
        </section>
        <section>
          <header>
            <h2>Past year</h2>
            <p>Presence of imported data over the past year.</p>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th />
                  <th>Jan</th>
                  <th>Feb</th>
                  <th>Mar</th>
                  <th>Apr</th>
                  <th>May</th>
                  <th>Jun</th>
                  <th>Jul</th>
                  <th>Aug</th>
                  <th>Sep</th>
                  <th>Oct</th>
                  <th>Nov</th>
                  <th>Dec</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>ADC</th>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                </tr>
                <tr>
                  <th>EMAR</th>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                  <td>#</td>
                </tr>
              </tbody>
            </table>
          </header>
        </section>
      </div>
    </div>
  </React.Fragment>
);

export default DashboardView;
