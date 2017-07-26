import React, { Component } from 'react';
import { render } from 'react-dom';

import TabGroup from './components/TabGroup';

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
      <div>
        {this.state.tabGroups.map(tabGroup =>
          <TabGroup key={tabGroup.id} {...tabGroup} />,
        )}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
