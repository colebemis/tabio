import React from 'react';
import PropTypes from 'prop-types';

const TabGroup = ({ tabs }) =>
  <ul>
    {tabs.map(tab =>
      <li key={tab.id}>
        {tab.title}
      </li>,
    )}
  </ul>;

TabGroup.propTypes = { tabs: PropTypes.arrayOf(PropTypes.object).isRequired };

export default TabGroup;
