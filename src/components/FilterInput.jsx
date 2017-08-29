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
  onChange: () => {},
};

const Input = glamorous.input(({ theme }) => ({
  flex: '0 0 auto',
  width: '100%',
  padding: '1rem 1.5rem',
  fontSize: '1.25rem',
  fontWeight: '500',
  color: theme.text,
  border: 'none',
  outline: 0,

  '&::placeholder': {
    color: theme.placeholderText,
  },
}));

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
