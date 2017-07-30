import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import TabGroup from './TabGroup';

const Container = glamorous.div({
  flex: '1 1 auto',
  overflow: 'auto',
});

const TabGroups = ({ tabGroups }) =>
  <Container>
    {tabGroups.map(tabGroup =>
      <TabGroup key={tabGroup.id} tabs={tabGroup.tabs} />,
    )}
  </Container>;

TabGroups.propTypes = {
  tabGroups: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TabGroups;
