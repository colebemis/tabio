import React, { Component } from 'react';

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

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.onInputChange}
        />
        <div>
          {this.state.tabGroups.map(tabGroup =>
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
