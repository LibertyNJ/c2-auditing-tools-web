import { ipcRenderer } from 'electron';
import React from 'react';

class Dashboard extends React.Component {
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
      },
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
        <h1 className="text-center">Dashboard</h1>
      </React.Fragment>
    );
  }
}

export default Dashboard;
