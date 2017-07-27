import React from 'react';
import PropTypes from 'prop-types';
import { Ul } from 'glamorous';

import Tab from './Tab';

const TabGroup = ({ tabs }) =>
  <Ul margin={0} padding={8}>
    {tabs.map(tab =>
      <Tab
        key={tab.id}
        favIconUrl={tab.favIconUrl}
        title={tab.title}
        url={tab.url}
      />,
    )}
  </Ul>;

TabGroup.propTypes = { tabs: PropTypes.arrayOf(PropTypes.object).isRequired };

export default TabGroup;
