import { ipcRenderer } from 'electron';
import React from 'react';

class LedgerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      datetimeEnd: '',
      datetimeStart: '',
      medicationOrderId: '',
      medicationProduct: '',
      provider: '',

      results: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const datetimeEnd = this.state.datetimeEnd;
    const datetimeStart = this.state.datetimeStart;
    const medicationOrderId = this.state.medicationOrderId;
    const medicationProduct = this.state.medicationProduct;
    const provider = this.state.provider;

    ipcRenderer.send('database', {
      header: 'query',
      body: {
        table: 'administration',
        parameters: {
          columns: ['providerAdcId', 'medicationProductId', 'amount', 'timestamp'],
          where: {
            timestamp: [
              { operator: '>', value: datetimeStart },
              { operator: '<', value: datetimeEnd },
            ],
            providerAdcId: { operator: '=', value: provider },
            medicationOrderId: { operator: 'LIKE', value: `%${medicationOrderId}%` },
            medicationProductId: { operator: '=', value: medicationProduct },
          },
        },
      }
    });

    ipcRenderer.once('database', (event, data) => {
      if (data.header === 'query') {
        this.setState({ results: data.body.results });
      }
    });
  }

  render() {
    const tableBodyRows = this.state.results.map(record => (
      <tr key={record.id}>
        <td>{record.timestamp}</td>
        <td>{record.providerAdcId}</td>
        <td>{record.medicationProductId}</td>
        <td>{record.amount}</td>
        <td>{record.medicationOrderId}</td>
      </tr>
    ));

    return (
      <React.Fragment>
        <h1 className="text-center">Ledger</h1>
        <div className="row">
          <div className="col-3">
            <section>
              <h2>Parameters</h2>
              <form className="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="datetimeStart">Start time</label>
                  <input
                    id="datetimeStart"
                    className="form-control"
                    type="datetime-local"
                    name="datetimeStart"
                    value={this.state.datetimeStart}
                    max="9999-12-31T23:59"
                    required
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="datetimeEnd">End time</label>
                  <input
                    id="datetimeEnd"
                    className="form-control"
                    type="datetime-local"
                    name="datetimeEnd"
                    value={this.state.datetimeEnd}
                    max="9999-12-31T23:59"
                    required
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="provider">Provider</label>
                  <input
                    id="provider"
                    className="form-control"
                    type="text"
                    name="provider"
                    value={this.state.provider}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medicationOrderId">Order ID</label>
                  <input
                    id="medicationOrderId"
                    className="form-control"
                    type="text"
                    name="medicationOrderId"
                    value={this.state.medicationOrderId}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="medicationProduct">Product</label>
                  <input
                    id="medicationProduct"
                    className="form-control"
                    type="text"
                    name="medicationProduct"
                    value={this.state.medicationProduct}
                    onChange={this.handleChange}
                  />
                </div>
                <button className="btn btn-primary d-block ml-auto" type="submit">
                  Search
                </button>
              </form>
            </section>
          </div>
          <div className="col-9">
            <section>
              <h2>Results</h2>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Provider</th>
                    <th scope="col">Withdrawn</th>
                    <th scope="col">Product</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Wasted</th>
                    <th scope="col">Dose</th>
                    <th scope="col">Administered</th>
                    <th scope="col">Order ID</th>
                  </tr>
                </thead>
                <tbody>{tableBodyRows}</tbody>
              </table>
            </section>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LedgerView;
