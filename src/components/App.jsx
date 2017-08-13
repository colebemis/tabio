import React, { Component } from 'react';
import Fuse from 'fuse.js';

class App extends Component {
  state = {
    inputValue: '',
    tabGroups: [],
  };

  componentDidMount() {
    // HACK: setTimeout prevents popup window from getting stuck at the wrong size
    // https://bugs.chromium.org/p/chromium/issues/detail?id=428044
    setTimeout(() => {
      chrome.windows.getAll({ populate: true }, tabGroups => {
        this.setState({ tabGroups });
      });
    }, 200);
  }

  onInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  filterTabGroups = (tabGroups, inputValue) => {
    if (inputValue === '') {
      return tabGroups;
    }

    return tabGroups
      .map(tabGroup => {
        const options = {
          threshold: 0.4,
          keys: ['title', 'url'],
        };

        const fuse = new Fuse(tabGroup.tabs, options);

        return Object.assign({}, tabGroup, { tabs: fuse.search(inputValue) });
      })
      .filter(tabGroup => tabGroup.tabs.length > 0);
  };

  render() {
    const tabGroups = this.filterTabGroups(
      this.state.tabGroups,
      this.state.inputValue,
    );

    return (
      <div>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.onInputChange}
        />
        <div>
          {tabGroups.map(tabGroup =>
            <ul key={tabGroup.id}>
              {tabGroup.tabs.map(tab =>
                <li
                  key={tab.id}
                  style={{ fontWeight: tab.active ? 'bold' : 'normal' }}
                >
                  {tab.title}
                </li>,
              )}
            </ul>,
          )}
        </div>
      </div>
    );
  }
}

export default App;
