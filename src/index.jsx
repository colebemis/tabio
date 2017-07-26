import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { tabGroups: [] };
  }

  componentDidMount() {
    chrome.windows.getAll({ populate: true }, tabGroups => {
      this.setState({ tabGroups });
    });
  }

  render() {
    return (
      <pre>
        <code>
          {JSON.stringify(this.state.tabGroups, null, 2)}
        </code>
      </pre>
    );
  }
}

render(<App />, document.getElementById('root'));
