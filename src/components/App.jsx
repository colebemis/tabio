import React, { Component } from 'react';
import { Div } from 'glamorous';
import fuzzysearch from 'fuzzysearch';

import FilterBar from './FilterBar';
import TabGroup from './TabGroup';

class App extends Component {
  state = { filterTerm: '', tabGroups: [], currentTabGroupId: '' };

  componentDidMount() {
    chrome.windows.getCurrent({}, tabGroup => {
      this.setState({ currentTabGroupId: tabGroup.id });
    });

    // HACK: prevent popup window from getting stuck at the wrong size
    // https://bugs.chromium.org/p/chromium/issues/detail?id=428044
    setTimeout(() => {
      chrome.windows.getAll({ populate: true }, tabGroups => {
        this.setState({ tabGroups });
      });
    }, 100);
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

  filterTabGroup = (tabGroups, filterTerm) => {
    if (filterTerm === '') {
      return tabGroups;
    }

    return tabGroups
      .map(tabGroup => {
        const filteredTabs = tabGroup.tabs.filter(tab =>
          fuzzysearch(
            filterTerm.toLowerCase(),
            `${tab.title} ${tab.url}`.toLowerCase(),
          ),
        );

        return Object.assign({}, tabGroup, { tabs: filteredTabs });
      })
      .filter(tabGroup => tabGroup.tabs.length > 0);
  };

  handleFilterTermChange = event => {
    this.setState({ filterTerm: event.target.value });
  };

  render() {
    const tabGroups = this.filterTabGroup(
      this.sortTabGroups(this.state.tabGroups, this.state.currentTabGroupId),
      this.state.filterTerm,
    );

    return (
      <Div width={400} color="rgba(0,0,0,0.7)">
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

export default App;
