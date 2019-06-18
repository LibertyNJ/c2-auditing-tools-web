import React from 'react';
import { ipcRenderer } from 'electron';

export default class DashboardView extends React.Component {
  state = {
    now: new Date(),
  };

  componentDidMount = () => {
    ipcRenderer.send('database', {
      header: { type: 'dashboard', response: 'dashboard' },
      body: '',
    });

    ipcRenderer.once('dashboard', (event, data) => {
      this.setState({
        unassignedAdcIds: data.body.unassignedAdcIds,
        unassignedEmarIds: data.body.unassignedEmarIds,
        earliestAdcData: data.body.earliestAdcData,
        earliestEmarData: data.body.earliestEmarData,
        latestAdcData: data.body.latestAdcData,
        latestEmarData: data.body.latestEmarData,
      });
    });
  };

  render = () => {
    const formatDate = dateString =>
      new Date(dateString).toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });

    return (
      <React.Fragment>
        <div className="row flex-shrink-0">
          <header className="col">
            <h1 className="text-primary text-center">Dashboard</h1>
            <p className="lead">
              Today is{' '}
              {this.state.now.toLocaleString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              .
            </p>
          </header>
        </div>
        <div className="row">
          <section className="col-3">
            <header>
              <h2 className="text-primary">Unassigned IDs</h2>
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>ADC IDs</th>
                    <th>EMAR IDs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{this.state.unassignedAdcIds}</td>
                    <td>{this.state.unassignedEmarIds}</td>
                  </tr>
                </tbody>
              </table>
            </header>
          </section>
          <section className="col-6">
            <header>
              <h2 className="text-primary">Data range</h2>
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th />
                    <th>Earliest</th>
                    <th>Latest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>ADC</th>
                    <td>{formatDate(this.state.earliestAdcData)}</td>
                    <td>{formatDate(this.state.latestAdcData)}</td>
                  </tr>
                  <tr>
                    <th>EMAR</th>
                    <td>{formatDate(this.state.earliestEmarData)}</td>
                    <td>{formatDate(this.state.latestEmarData)}</td>
                  </tr>
                </tbody>
              </table>
            </header>
          </section>
        </div>
      </React.Fragment>
    );
  };
}
