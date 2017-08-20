import React, { Component } from 'react';
import Fuse from 'fuse.js';

import Highlighter from './Highlighter';

class App extends Component {
  state = {
    inputValue: '',
    tabs: [],
    highlightedIndex: 0,
    currentWindowId: null,
  };

  componentDidMount() {
    // HACK: setTimeout prevents popup window from getting stuck at the wrong size
    // https://bugs.chromium.org/p/chromium/issues/detail?id=428044
    setTimeout(() => {
      chrome.tabs.query({}, tabs => {
        this.setState({ tabs });
      });

      chrome.windows.getCurrent({}, window => {
        this.setState({ currentWindowId: window.id });
      });
    }, 200);
  }

  getActiveIndex = (tabs, currentWindowId) =>
    tabs.findIndex(tab => tab.windowId === currentWindowId && tab.active);

  handleInputChange = ({ target: { value } }) => {
    const { tabs, currentWindowId } = this.state;

    this.setState({
      inputValue: value,
      highlightedIndex:
        value === '' ? this.getActiveIndex(tabs, currentWindowId) : 0,
    });
  };

  handleHighlightChange = ({ highlightedIndex }) => {
    this.setState({ highlightedIndex });
  };

  filterTabs = (tabs, inputValue) => {
    if (inputValue === '') {
      return tabs;
    }

    const options = {
      threshold: 0.5,
      keys: ['title', 'url'],
    };

    const fuse = new Fuse(tabs, options);

    return fuse.search(inputValue);
  };

  render() {
    const tabs = this.filterTabs(this.state.tabs, this.state.inputValue);

    return (
      <div>
        <input
          type="text"
          placeholder="Jump to..."
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <Highlighter
          highlightedIndex={this.state.highlightedIndex}
          itemCount={tabs.length}
          onChange={this.handleHighlightChange}
        >
          {({ highlightedIndex, setHighlightedIndex }) =>
            <ul>
              {tabs.map((tab, index) =>
                <li
                  key={tab.id}
                  style={{
                    fontWeight:
                      tab.windowId === this.state.currentWindowId && tab.active
                        ? 'bold'
                        : 'normal',
                    backgroundColor:
                      index === highlightedIndex ? 'lightgray' : 'white',
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {tab.title}
                </li>,
              )}
            </ul>}
        </Highlighter>
      </div>
    );
  }
}

export default App;
