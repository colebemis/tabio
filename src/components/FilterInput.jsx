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
  padding: '16px 24px',
  fontSize: 20,
  fontWeight: 500,
  color: theme.textColor,
  border: 'none',
  boxShadow: `0 1px 0 ${theme.dividerColor}`,
  outline: 0,
  zIndex: 0,

  '&::placeholder': {
    color: theme.placeholderTextColor,
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
      autoFocus
    />
  );
}

FilterInput.propTypes = propTypes;
FilterInput.defaultProps = defaultProps;

export default FilterInput;
