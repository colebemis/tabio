import React, { Component } from 'react';
import { render } from 'react-dom';
import { Div } from 'glamorous';

import FilterBar from './components/FilterBar';
import TabGroup from './components/TabGroup';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { filterTerm: '', tabGroups: [] };
  }

  componentDidMount() {
    setTimeout(() => {
      chrome.windows.getAll({ populate: true }, tabGroups => {
        this.setState({ tabGroups });
      });
    }, 250);
  }

  handleFilterTermChange = event => {
    this.setState({ filterTerm: event.target.value });
  };

  render() {
    return (
      <Div width={400}>
        <FilterBar
          filterTerm={this.state.filterTerm}
          onChange={this.handleFilterTermChange}
        />
        {this.state.tabGroups.map(tabGroup =>
          <TabGroup key={tabGroup.id} tabs={tabGroup.tabs} />,
        )}
      </Div>
    );
  }
}

render(<App />, document.getElementById('root'));
