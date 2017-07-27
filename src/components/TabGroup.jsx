import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import Tab from './Tab';

const Container = glamorous.ul({
  margin: 0,
  padding: 8,
});

const TabGroup = ({ tabs }) =>
  <Container>
    {tabs.map(tab =>
      <Tab
        key={tab.id}
        favIconUrl={tab.favIconUrl}
        title={tab.title}
        url={tab.url}
      />,
    )}
  </Container>;

TabGroup.propTypes = { tabs: PropTypes.arrayOf(PropTypes.object).isRequired };

export default TabGroup;
