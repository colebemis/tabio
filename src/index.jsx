import React, { Component } from 'react';
import { render } from 'react-dom';
import { Div } from 'glamorous';

import TabGroup from './components/TabGroup';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { tabGroups: [] };
  }

  componentDidMount() {
    setTimeout(() => {
      chrome.windows.getAll({ populate: true }, tabGroups => {
        this.setState({ tabGroups });
      });
    }, 250);
  }

  render() {
    return (
      <Div width={400}>
        {this.state.tabGroups.map(tabGroup =>
          <TabGroup key={tabGroup.id} tabs={tabGroup.tabs} />,
        )}
      </Div>
    );
  }
}

render(<App />, document.getElementById('root'));
