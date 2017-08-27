import React, { Component } from 'react';
import Fuse from 'fuse.js';
import glamorous, { ThemeProvider, Div } from 'glamorous';

import FilterInput from './FilterInput';
import Highlighter from './Highlighter';
import Tab from './Tab';

const theme = {
  accent: '#0366D6',
  text: 'rgba(0, 0, 0, 0.9)',
  placeholderText: 'rgba(0, 0, 0, 0.3)',
  highlightedText: '#FFFFFF',
};

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  width: '25rem',
  maxHeight: 600,
});

class App extends Component {
  state = {
    filterValue: '',
    tabs: [],
    currentWindowId: null,
    highlightedIndex: 0,
  };

  componentDidMount() {
    // HACK: setTimeout prevents popup window from getting stuck at the wrong size
    // https://bugs.chromium.org/p/chromium/issues/detail?id=428044
    setTimeout(() => {
      const promises = [
        new Promise(resolve => {
          chrome.tabs.query({}, tabs => resolve(tabs));
        }),
        new Promise(resolve => {
          chrome.windows.getCurrent({}, ({ id }) => resolve(id));
        }),
      ];

      Promise.all(promises).then(([tabs, currentWindowId]) => {
        const highlightedIndex = this.getActiveIndex(tabs, currentWindowId);

        this.setState({
          tabs,
          currentWindowId,
          highlightedIndex,
        });
      });
    }, 200);
  }

  getActiveIndex = (tabs, currentWindowId) =>
    tabs.findIndex(tab => tab.windowId === currentWindowId && tab.active);

  handleFilterChange = ({ target: { value } }) => {
    const { tabs, currentWindowId } = this.state;

    this.setState({
      filterValue: value,
      highlightedIndex:
        value === '' ? this.getActiveIndex(tabs, currentWindowId) : 0,
    });
  };

  handleHighlightChange = highlightedIndex => {
    this.setState({ highlightedIndex });
  };

  handleTabSelect = tab => {
    chrome.windows.update(tab.windowId, { focused: true }, () => {
      chrome.tabs.update(tab.id, { active: true });
    });
  };

  handleTabRemove = tab => {
    const { tabs } = this.state;

    chrome.tabs.remove(tab.id);

    this.setState({
      // remove closed tab from tabs array
      tabs: tabs.filter(({ id }) => id !== tab.id),
    });
  };

  filterTabs = (tabs, filterValue) => {
    if (filterValue === '') {
      return tabs;
    }

    const options = {
      threshold: 0.5,
      keys: ['title', 'url'],
    };

    const fuse = new Fuse(tabs, options);

    return fuse.search(filterValue);
  };

  render() {
    const tabs = this.filterTabs(this.state.tabs, this.state.filterValue);

    return (
      <ThemeProvider theme={theme}>
        <Container>
          <FilterInput
            placeholder="Jump to..."
            value={this.state.filterValue}
            onChange={this.handleFilterChange}
          />
          <Highlighter
            items={tabs}
            highlightedIndex={this.state.highlightedIndex}
            onChange={this.handleHighlightChange}
            onSelect={this.handleTabSelect}
            onRemove={this.handleTabRemove}
          >
            {({
              items,
              highlightedIndex,
              changeHighlightedIndex,
              selectItem,
              removeItem,
            }) =>
              <Div flex="1 1 auto" overflow="auto" padding="0.75rem">
                {items.map((item, index) =>
                  <Tab
                    key={item.id}
                    tab={item}
                    isActive={
                      item.windowId === this.state.currentWindowId &&
                      item.active
                    }
                    isHighlighted={index === highlightedIndex}
                    onMouseEnter={() => changeHighlightedIndex(index)}
                    onClick={() => selectItem(item)}
                    onRemove={event => {
                      removeItem(item, index);
                      event.stopPropagation();
                    }}
                  />,
                )}
              </Div>}
          </Highlighter>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
