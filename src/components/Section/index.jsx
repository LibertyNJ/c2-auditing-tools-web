import React from 'react';
import PropTypes from 'prop-types';

import Header from './Header';

Section.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  heading: PropTypes.node.isRequired,
  level: PropTypes.number.isRequired,
  style: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
};

Section.defaultProps = {
  className: null,
  headerClassName: null,
  style: null,
};

export default function Section({
  children, className, headerClassName, heading, level, style,
}) {
  return (
    <section className={className} style={style}>
      <Header classname={headerClassName} level={level}>
        {heading}
      </Header>
      {children}
    </section>
  );
}
