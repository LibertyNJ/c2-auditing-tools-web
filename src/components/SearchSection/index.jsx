import React from 'react';
import PropTypes from 'prop-types';

import Form from '../Form';
import Section from '../Section';

SearchSection.propTypes = {
  channel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SearchSection.defaultProps = {
  className: '',
};

export default function SearchSection({ channel, children, className }) {
  return (
    <Section
      className={`d-flex flex-column col-2 ${className}`}
      headerClassName="flex-grow-0 flex-shrink-0"
      heading="Search"
      level={2}
    >
      <Form channel={channel} className="flex-grow-1 flex-shrink-1 overflow-auto px-1 pr-3 mx-n1">
        {children}
      </Form>
    </Section>
  );
}
