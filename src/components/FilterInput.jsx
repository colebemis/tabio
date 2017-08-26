import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const defaultProps = {
  placeholder: '',
  value: '',
  onChange: '',
};

function FilterInput({ placeholder, value, onChange }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

FilterInput.propTypes = propTypes;
FilterInput.defaultProps = defaultProps;

export default FilterInput;
