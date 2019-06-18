import PropTypes from 'prop-types';
import React from 'react';

import Input from '../Input';
import FormRow from '../FormRow';

const ModalBody = props => {
  const adcIds = props.adcIds.map(adcId => (
    <li key={adcId} className="list-group-item list-group-item-action">
      <button
        className="btn btn-link stretched-link text-reset text-decoration-none p-0 shadow-none"
        type="button"
        data-id={adcId}
        data-id-type="Adc"
        onClick={this.handleClick}
      >
        {adcId}
        {props.removeAdcIds.includes(adcId) && (
          <React.Fragment>
            {' '}
            <SVGIcon
              className="align-baseline"
              type="trash"
              width="1em"
              height="1em"
              fill="red"
            />
          </React.Fragment>
        )}
      </button>
    </li>
  ));

  const emarIds = props.emarIds.map(emarId => (
    <li key={emarId} className="list-group-item list-group-item-action">
      <button
        className="btn btn-link stretched-link text-reset text-decoration-none p-0 shadow-none"
        type="button"
        data-id={emarId}
        data-id-type="Emar"
        onClick={this.handleClick}
      >
        {emarId}
        {props.removeEmarIds.includes(emarId) && (
          <React.Fragment>
            {' '}
            <SVGIcon
              className="align-baseline"
              type="trash"
              width="1em"
              height="1em"
              fill="red"
            />
          </React.Fragment>
        )}
      </button>
    </li>
  ));

  const providerAdcs = props.providerAdcs.map(({ id, name }) => ({
    value: id,
    text: name,
  }));

  providerAdcs.unshift({
    value: 0,
    text: '',
  });

  const providerEmars = props.providerEmars.map(({ id, name }) => ({
    value: id,
    text: name,
  }));

  providerEmars.unshift({
    value: 0,
    text: '',
  });

  return (
    <div className="modal-body">
      <p className="lead">
        {props.lastName}, {props.firstName} {props.middleInitial}
      </p>
      <FormRow>
        <section className="col">
          <h4 className="text-primary">Name</h4>
          <FormRow>
            <Input
              type="text"
              name="editLastName"
              value={props.editLastName}
              isDisabled={props.isSubmitted}
              label="Last"
              handleChange={props.handleChange}
              wrapperClassName="col-5"
            />
            <Input
              type="text"
              name="editFirstName"
              value={props.editFirstName}
              isDisabled={props.isSubmitted}
              label="First"
              handleChange={props.handleChange}
              wrapperClassName="col-5"
            />
            <Input
              type="text"
              name="editMiddleInitial"
              value={props.editMiddleInitial}
              isDisabled={props.isSubmitted}
              label="MI"
              handleChange={props.handleChange}
              wrapperClassName="col-2"
            />
          </FormRow>
        </section>
      </FormRow>
      <section>
        <header className="form-row">
          <div className="col">
            <h4 className="text-primary">Remove IDs</h4>
          </div>
        </header>
        <FormRow>
          <section className="col">
            <h5>ADC IDs</h5>
            {adcIds.length > 0 ? (
              <ul className="list-group mb-1">{adcIds}</ul>
            ) : (
              <div className="alert alert-warning">
                No assigned ADC IDs found!
              </div>
            )}
          </section>
          <section className="col">
            <h5>EMAR IDs</h5>
            {emarIds.length > 0 ? (
              <ul className="list-group mb-1">{emarIds}</ul>
            ) : (
              <div className="alert alert-info">
                No assigned EMAR IDs found!
              </div>
            )}
          </section>
        </FormRow>
      </section>
      <section>
        <header className="form-row">
          <div className="col">
            <h4 className="text-primary">Add IDs</h4>
          </div>
        </header>
        <FormRow>
          <section className="col">
            {providerAdcs.length > 1 ? (
              <Select
                name="addAdcId"
                value={props.addAdcId}
                isDisabled={props.isSubmitted}
                label="Add ADC ID"
                options={providerAdcs}
                handleChange={props.handleChange}
              />
            ) : (
              <div className="alert alert-info">
                No unassigned ADC IDs found!
              </div>
            )}
          </section>
          <section className="col">
            {providerEmars.length > 1 ? (
              <Select
                name="addEmarId"
                value={props.addEmarId}
                isDisabled={props.isSubmitted}
                label="Add EMAR ID"
                options={providerEmars}
                handleChange={props.handleChange}
              />
            ) : (
              <div className="alert alert-info">
                No unassigned EMAR IDs found!
              </div>
            )}
          </section>
        </FormRow>
      </section>
    </div>
  );
};

export default ModalBody;
