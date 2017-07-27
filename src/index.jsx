import React, { Component } from 'react';
import { render } from 'react-dom';
import { Div } from 'glamorous';

import FilterBar from './components/FilterBar';
import TabGroup from './components/TabGroup';

class App extends Component {
  state = { filterTerm: '', tabGroups: [], currentTabGroupId: '' };

  componentDidMount() {
    chrome.windows.getCurrent({}, tabGroup => {
      this.setState({ currentTabGroupId: tabGroup.id });
    });

    setTimeout(() => {
      chrome.windows.getAll({ populate: true }, tabGroups => {
        this.setState({ tabGroups });
      });
    }, 250);
  }

  sortTabGroups = (tabGroups, currentTabGroupId) => {
    if (tabGroups.length === 0 || currentTabGroupId === '') {
      return tabGroups;
    }

    // copy tabGroups
    const sortedTabGroups = tabGroups.slice();

    // find current tab group index
    const currentTabGroupIndex = sortedTabGroups.findIndex(
      tabGroup => tabGroup.id === currentTabGroupId,
    );

    // remove current tab group from sortedTabGroups
    const currentTabGroup = sortedTabGroups.splice(currentTabGroupIndex, 1)[0];

    // add current tab group to beginning of sortedTabGroups
    sortedTabGroups.unshift(currentTabGroup);

    return sortedTabGroups;
  };

  handleFilterTermChange = event => {
    this.setState({ filterTerm: event.target.value });
  };

  render() {
    const tabGroups = this.sortTabGroups(
      this.state.tabGroups,
      this.state.currentTabGroupId,
    );

    return (
      <Div width={400}>
        <FilterBar
          filterTerm={this.state.filterTerm}
          onChange={this.handleFilterTermChange}
        />
        {tabGroups.map(tabGroup =>
          <TabGroup key={tabGroup.id} tabs={tabGroup.tabs} />,
        )}
      </Div>
    );
  }
}

render(<App />, document.getElementById('root'));
