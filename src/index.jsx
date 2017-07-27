import React, { Component } from 'react';
import { render } from 'react-dom';
import glamorous from 'glamorous';

import TabGroup from './components/TabGroup';

const Container = glamorous.div({
  width: 400,
});

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
      <Container>
        {this.state.tabGroups.map(tabGroup =>
          <TabGroup key={tabGroup.id} tabs={tabGroup.tabs} />,
        )}
      </Container>
    );
  }
}

render(<App />, document.getElementById('root'));
