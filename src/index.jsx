import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { foo: 'bar' };
  }

  render() {
    return (
      <h1>
        {this.state.foo}
      </h1>
    );
  }
}

render(<App />, document.getElementById('root'));
