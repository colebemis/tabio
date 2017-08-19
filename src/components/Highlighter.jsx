import React, { Component } from 'react';

class Hightlighter extends Component {
  state = {
    highlighted: {
      tabGroupIndex: 0,
      tabIndex: 0,
    },
  };

  onKeyDown = event => {
    switch (event.key) {
      case 'ArrowUp':
        this.highlightPrevTab();
        break;
      case 'ArrowDown':
        this.highlightNextTab();
        break;
    }
  };

  getInputProps = props => ({ onKeyDown: this.onKeyDown, ...props });

  highlight = ({ tabGroupIndex, tabIndex }) => {
    this.setState({
      highlighted: {
        tabGroupIndex,
        tabIndex,
      },
    });
  };

  highlightNextTab = () => {
    const { tabGroups } = this.props;
    const { highlighted } = this.state;

    if (tabGroups.length === 0) return;

    let newTabGroupIndex;
    let newTabIndex;

    if (
      highlighted.tabIndex <
      tabGroups[highlighted.tabGroupIndex].tabs.length - 1
    ) {
      // if highlighted tab is not last tab in tabGroup
      // highlight next tab
      newTabGroupIndex = highlighted.tabGroupIndex;
      newTabIndex = highlighted.tabIndex + 1;
    } else if (highlighted.tabGroupIndex < tabGroups.length - 1) {
      // if highlighted tab is not in last tabGroup
      // highlight first tab in next tabGroup
      newTabGroupIndex = highlighted.tabGroupIndex + 1;
      newTabIndex = 0;
    } else {
      // highlight first tab in first tabGroup
      newTabGroupIndex = 0;
      newTabIndex = 0;
    }

    this.highlight({
      tabGroupIndex: newTabGroupIndex,
      tabIndex: newTabIndex,
    });
  };

  highlightPrevTab = () => {
    const { tabGroups } = this.props;
    const { highlighted } = this.state;

    if (tabGroups.length === 0) return;

    let newTabGroupIndex;
    let newTabIndex;

    if (highlighted.tabIndex > 0) {
      // if highlighted tab is not first tab in tabGroup
      // highlight previous tab
      newTabGroupIndex = highlighted.tabGroupIndex;
      newTabIndex = highlighted.tabIndex - 1;
    } else if (highlighted.tabGroupIndex > 0) {
      // if highlighted tab is not in first tabGroup
      // highlight last tab in previous tabGroup
      newTabGroupIndex = highlighted.tabGroupIndex - 1;
      newTabIndex = tabGroups[newTabGroupIndex].tabs.length - 1;
    } else {
      // highlight last tab in last tabGroup
      newTabGroupIndex = tabGroups.length - 1;
      newTabIndex = tabGroups[newTabGroupIndex].tabs.length - 1;
    }

    this.highlight({
      tabGroupIndex: newTabGroupIndex,
      tabIndex: newTabIndex,
    });
  };

  render() {
    return this.props.children({
      getInputProps: this.getInputProps,
      highlighted: this.state.highlighted,
      highlight: this.highlight,
    });
  }
}

export default Hightlighter;
