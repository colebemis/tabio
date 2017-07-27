import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Input = glamorous.input({
  width: '100%',
  height: 64,
  padding: '0 20px',
  fontFamily: 'inherit',
  fontSize: 24,
  color: 'inherit',
  border: 'none',
  boxShadow: '0 1px 0 rgba(0, 0, 0, 0.1)',
  outline: 'none',
});

const FilterBar = ({ filterTerm, onChange }) =>
  <Input type="text" value={filterTerm} onChange={onChange} />;

FilterBar.propTypes = {
  filterTerm: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FilterBar;
