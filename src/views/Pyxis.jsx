import PropTypes from 'prop-types';
import React from 'react';
import sqlite3 from 'sqlite3';

class Pyxis extends React.Component {
  constructor() {
    super();

    this.state = {
      startDatetime: '',
      endDatetime: '',
      provider: '',
      medication: '',
      transactionTypes: [],
      orderId: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    let value;

    if (target.tagName === 'SELECT') {
      const options = target.options;
      value = [...options]
        .filter(option => option.selected)
        .map(option => option.value);

      this.setState({ [name]: value });
    } else {
      value = target.value;
    }
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const start = `timestamp>='${this.state.startDatetime}'`;
    const end = ` AND timestamp<='${this.state.endDatetime}'`;
    const provider = this.state.provider
      ? ` AND providerId LIKE '%${this.state.provider}%'`
      : '';
    const medication = this.state.medication
      ? ` AND medicationId LIKE '%${this.state.medication}%'`
      : '';
    const medicationOrderId = this.state.orderId
      ? ` AND medicationOrderId LIKE '%${this.state.orderId}%'`
      : '';

    const sql = `
    SELECT * 
    FROM ${this.state.transactionTypes.join(', ')}
    WHERE ${start}${end}${provider}${medication}${medicationOrderId}
    `;

    const db = new sqlite3.Database(`${__dirname}/../data/database.db`, err => {
      if (err) {
        alert(err);
      } else {
        alert('Connected to database.');
      }
    });

    db.all(sql, (err, rows) => {
      if (err) {
        alert(err);
      } else {
        console.log(rows);
      }
    });

    db.close(err => {
      if (err) {
        alert(err);
      } else {
        alert('Closed connection to database.');
      }
    });
  }

  render() {
    return (
      <main className="container-fluid overflow-auto">
        <h2>Pyxis</h2>
        <Filters
          {...this.state}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />
        <Table />
      </main>
    );
  }
}

function Filters(props) {
  return (
    <form className="form" onSubmit={props.handleSubmit}>
      <div className="form-row">
        <div className="col">
          <Input
            type="datetime-local"
            name="startDatetime"
            value={props.startDatetime}
            label="Start date"
            onChange={props.handleChange}
            attributes={{
              max: '9999-12-31T23:59',
              required: true,
            }}
          />
        </div>
        <div className="col">
          <Input
            type="datetime-local"
            name="endDatetime"
            value={props.endDatetime}
            label="End date"
            onChange={props.handleChange}
            attributes={{
              max: '9999-12-31T23:59',
              required: true,
            }}
          />
        </div>
        <div className="col">
          <Input
            type="text"
            name="provider"
            value={props.provider}
            label="Provider"
            onChange={props.handleChange}
            attributes={{
              placeholder: 'Lastname, Firstname…',
            }}
          />
        </div>
        <div className="col">
          <Input
            type="text"
            name="medication"
            value={props.medication}
            label="Medication"
            onChange={props.handleChange}
            attributes={{
              placeholder: 'Medication…',
            }}
          />
        </div>
        <div className="col">
          <Input
            type="text"
            name="orderId"
            value={props.orderId}
            label="Order ID"
            onChange={props.handleChange}
            attributes={{
              maxLength: '9',
              placeholder: '00123ABCD…',
            }}
          />
        </div>
        <div className="col">
          <Select
            name="transactionTypes"
            value={props.transactionTypes}
            label="Transaction types"
            onChange={props.handleChange}
            options={['Withdrawal', 'Waste', 'Restock', 'Return']}
            attributes={{
              required: true,
              multiple: true,
            }}
          />
        </div>
        <div className="col align-self-center text-center">
          <button className="btn btn-primary btn-lg" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

function Input(props) {
  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <input
        id={props.name}
        className="form-control"
        type={props.type}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        {...props.attributes}
      />
      {props.info && (
        <small className="form-text text-info">{props.info}</small>
      )}
    </div>
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function Select(props) {
  const options = props.options.map((option, index) => (
    <option key={index} name={props.name} value={option.toLowerCase()}>
      {option}
    </option>
  ));

  return (
    <div className="form-group">
      <label htmlFor={props.name}>{props.label}</label>
      <select
        id={props.name}
        className="custom-select"
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        {...props.attributes}
      >
        {options}
      </select>
    </div>
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
          <th scope="col">Transaction</th>
          <th scope="col">Strength</th>
          <th scope="col">Waste</th>
          <th scope="col">MRN</th>
          <th scope="col">Order ID</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>Withdrawn</td>
          <td>## mG</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>Withdrawn</td>
          <td>## mG</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>Withdrawn</td>
          <td>## mG</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>Withdrawn</td>
          <td>## mG</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
        <tr>
          <td>YYYY/MM/DD hh:mm</td>
          <td>Last, First</td>
          <td>Medication</td>
          <td>Withdrawn</td>
          <td>## mG</td>
          <td>## mG</td>
          <td>12345678</td>
          <td>00123ABCD</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Pyxis;
