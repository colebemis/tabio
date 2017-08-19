import React, { Component } from 'react';
import Fuse from 'fuse.js';

import Hightlighter from './Highlighter';

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
      <Hightlighter tabGroups={tabGroups}>
        {({ getInputProps, highlighted, highlight }) =>
          <div>
            <input
              {...getInputProps({
                type: 'text',
                value: this.state.inputValue,
                onChange: this.onInputChange,
              })}
            />
            {tabGroups.map((tabGroup, tabGroupIndex) =>
              <ul key={tabGroup.id}>
                {tabGroup.tabs.map((tab, tabIndex) =>
                  <li
                    key={tab.id}
                    onMouseOver={() => highlight({ tabGroupIndex, tabIndex })}
                    style={{
                      fontWeight: tab.active ? 'bold' : 'normal',
                      backgroundColor:
                        tabGroupIndex === highlighted.tabGroupIndex &&
                        tabIndex === highlighted.tabIndex
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
    );
  }
}

export default App;
