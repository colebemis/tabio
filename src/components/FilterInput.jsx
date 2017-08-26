import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

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

const Input = glamorous.input({
  width: '100%',
  padding: 16,
  fontSize: 20,
  fontWeight: '500',
  color: 'inherit',
  border: 'none',
  boxShadow: '0 1px 0 rgba(0, 0, 0, 0.12)',
  outline: 0,

  '&::placeholder': {
    color: 'rgba(0, 0, 0, 0.38)',
  },
});

function FilterInput({ placeholder, value, onChange }) {
  return (
    <Input
      type="text"
      spellCheck={false}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

FilterInput.propTypes = propTypes;
FilterInput.defaultProps = defaultProps;

export default FilterInput;
