import path from 'path';
import PropTypes from 'prop-types';
import React from 'react';

import { reduceClassNames } from '../../util';

const LABEL_BASE_CLASS_NAME = 'custom-file-label text-nowrap';

FileInput.propTypes = {
  inputClassName: PropTypes.string,
  label: PropTypes.node.isRequired,
  labelClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

export default function FileInput({
  inputClassName,
  label,
  labelClassName,
  name,
  value,
  wrapperClassName,
  ...restProps
}) {
  return (
    <div className={reduceClassNames('custom-file', wrapperClassName)}>
      <input
        className={reduceClassNames('custom-file-input', inputClassName)}
        id={name}
        name={name}
        type="file"
        value={value}
        {...restProps}
      />
      <label className={reduceClassNames(LABEL_BASE_CLASS_NAME, labelClassName)} htmlFor={name}>
        {label}: {path.basename(value)}
      </label>
    </div>
  );
}
