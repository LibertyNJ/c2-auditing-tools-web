import React from 'react';
import PropTypes from 'prop-types';

ProviderName.propTypes = {
  first: PropTypes.string,
  last: PropTypes.string,
  middleInitial: PropTypes.string,
};

ProviderName.defaultProps = {
  first: undefined,
  last: undefined,
  middleInitial: undefined,
};

export default function ProviderName({ last, first, middleInitial }) {
  return (
    <p className="lead">
      {last}, {first} {middleInitial}
    </p>
  );
}
