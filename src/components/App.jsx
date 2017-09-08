import React, { Component } from 'react';
import Fuse from 'fuse.js';
import glamorous, { ThemeProvider, Span } from 'glamorous';

import FilterInput from './FilterInput';
import List from './List';
import Tab from './Tab';

const theme = {
  primaryColor: '#0052CC',
  textColor: 'rgba(0, 0, 0, 0.8)',
  placeholderTextColor: 'rgba(0, 0, 0, 0.4)',
  highlightedTextColor: '#FFFFFF',
  dividerColor: 'rgba(0, 0, 0, 0.1)',
};

const Container = glamorous.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: 400,
  maxHeight: 600,
  color: theme.textColor,
}));

class App extends Component {
  state = {
    filterValue: '',
    tabs: null,
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
          {tabs && (
            <List
              style={{ flex: '1 1 auto', padding: 12 }}
              data={tabs}
              highlightedIndex={this.state.highlightedIndex}
              onChange={this.handleHighlightChange}
              onSelect={this.handleTabSelect}
              onRemove={this.handleTabRemove}
              renderItem={({ item, isHighlighted, itemEventHandlers }) => (
                <Tab
                  key={item.id}
                  tab={item}
                  isHighlighted={isHighlighted}
                  isActive={
                    item.windowId === this.state.currentWindowId && item.active
                  }
                  {...itemEventHandlers}
                />
              )}
              renderEmpty={() => (
                <Span
                  display="block"
                  padding={12}
                  fontSize={14}
                  textAlign="center"
                >
                  No matches found.
                </Span>
              )}
            />
          )}
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
