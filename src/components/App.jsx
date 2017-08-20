import React, { Component } from 'react';
import Fuse from 'fuse.js';

import Hightlighter from './Highlighter';

class App extends Component {
  state = {
    inputValue: '',
    tabGroups: [],
    currentTabGroupId: null,
    highlightedIndex: { tabGroupIndex: 0, tabIndex: 0 },
  };

  componentDidMount() {
    // HACK: setTimeout prevents popup window from getting stuck at the wrong size
    // https://bugs.chromium.org/p/chromium/issues/detail?id=428044
    setTimeout(() => {
      chrome.windows.getAll({ populate: true }, tabGroups => {
        this.setState({ tabGroups });
      });

      chrome.windows.getCurrent(tabGroup => {
        this.setState({ currentTabGroupId: tabGroup.id });
      });
    }, 200);
  }

  getActiveIndex = (tabGroups, currentTabGroupId) => {
    const currentTabGroupIndex = tabGroups.findIndex(
      tabGroup => tabGroup.id === currentTabGroupId,
    );

    const activeTabIndex = tabGroups[currentTabGroupIndex].tabs.findIndex(
      tab => tab.active,
    );

    return {
      tabGroupIndex: currentTabGroupIndex,
      tabIndex: activeTabIndex,
    };
  };

  handleHighlightChange = changes => {
    this.setState(changes);
  };

  handleInputChange = event => {
    const { tabGroups, currentTabGroupId } = this.state;
    let highlightedIndex;

    if (event.target.value === '') {
      highlightedIndex = this.getActiveIndex(tabGroups, currentTabGroupId);
    } else {
      highlightedIndex = { tabGroupIndex: 0, tabIndex: 0 };
    }

    this.setState({
      inputValue: event.target.value,
      highlightedIndex,
    });
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

        return { tabGroup, ...{ tabs: fuse.search(inputValue) } };
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
          onChange={this.handleInputChange}
        />
        <Hightlighter
          tabGroups={tabGroups}
          highlightedIndex={this.state.highlightedIndex}
          onStateChange={this.handleHighlightChange}
        >
          {({ highlightedIndex, highlight }) =>
            <div>
              {tabGroups.map((tabGroup, tabGroupIndex) =>
                <ul key={tabGroup.id}>
                  {tabGroup.tabs.map((tab, tabIndex) =>
                    <li
                      key={tab.id}
                      onMouseOver={() => highlight({ tabGroupIndex, tabIndex })}
                      style={{
                        fontWeight:
                          tabGroup.id === this.state.currentTabGroupId &&
                          tab.active
                            ? 'bold'
                            : 'normal',
                        backgroundColor:
                          tabGroupIndex === highlightedIndex.tabGroupIndex &&
                          tabIndex === highlightedIndex.tabIndex
                            ? 'lightgray'
                            : 'white',
                      }}
                    >
                      {tab.title}
                    </li>,
                  )}
                </ul>,
              )}
            </div>}
        </Hightlighter>
      </div>
    );
  }
}

export default App;
