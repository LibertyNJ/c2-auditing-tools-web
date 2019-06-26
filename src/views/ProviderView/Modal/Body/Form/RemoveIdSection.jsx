import React from 'react';
import PropTypes from 'prop-types';

import SVGIcon from '../../../../../components/SVGIcon';

RemoveIdSection.propTypes = {
  adcIds: PropTypes.array,
  emarIds: PropTypes.array,
};

RemoveIdSection.defaultProps = {
  adcIds: [],
  emarIds: [],
};

export default function RemoveIdSection(props) {
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

  return (
    <section>
      <h4 className="text-primary">Remove IDs</h4>
      <section>
        <h5>ADC IDs</h5>
        <ul className="list-group mb-1">{adcIds}</ul>
        <div className="alert alert-warning">No assigned ADC IDs found!</div>
      </section>
      <section>
        <h5>EMAR IDs</h5>
        <ul className="list-group mb-1">{emarIds}</ul>
        <div className="alert alert-info">No assigned EMAR IDs found!</div>
      </section>
    </section>
  );
}
