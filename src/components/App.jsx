import React, { Component } from 'react';

class App extends Component {
  state = {
    filterTerm: '',
    tabGroups: [],
  };

  componentDidMount() {
    // HACK: prevent popup window from getting stuck at the wrong size
    // https://bugs.chromium.org/p/chromium/issues/detail?id=428044
    setTimeout(() => {
      chrome.windows.getAll({ populate: true }, tabGroups => {
        this.setState({ tabGroups });
      });
    }, 200);
  }

  setFilterTerm = event => {
    this.setState({ filterTerm: event.target.value });
  };

  render() {
    return (
      <div>
        Hello World
      </div>
    );
  }
}

export default App;
