import { Component } from 'react';
import Mousetrap from 'mousetrap';

class Hightlighter extends Component {
  componentDidMount() {
    Mousetrap.prototype.stopCallback = () => false;
    Object.keys(this.keyHandlers).forEach(key => {
      Mousetrap.bind(key, this.keyHandlers[key]);
    });
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  getNextIndex = () => {
    const { tabGroups, highlightedIndex } = this.props;

    if (tabGroups.length === 0) return;

    let newTabGroupIndex;
    let newTabIndex;

    if (
      highlightedIndex.tabIndex <
      tabGroups[highlightedIndex.tabGroupIndex].tabs.length - 1
    ) {
      // if highlighted tab is not last tab in tabGroup
      // highlight next tab
      newTabGroupIndex = highlightedIndex.tabGroupIndex;
      newTabIndex = highlightedIndex.tabIndex + 1;
    } else if (highlightedIndex.tabGroupIndex < tabGroups.length - 1) {
      // if highlighted tab is not in last tabGroup
      // highlight first tab in next tabGroup
      newTabGroupIndex = highlightedIndex.tabGroupIndex + 1;
      newTabIndex = 0;
    } else {
      // highlight first tab in first tabGroup
      newTabGroupIndex = 0;
      newTabIndex = 0;
    }

    return {
      tabGroupIndex: newTabGroupIndex,
      tabIndex: newTabIndex,
    };
  };

  getPrevIndex = () => {
    const { tabGroups, highlightedIndex } = this.props;

    if (tabGroups.length === 0) return;

    let newTabGroupIndex;
    let newTabIndex;

    if (highlightedIndex.tabIndex > 0) {
      // if highlighted tab is not first tab in tabGroup
      // highlight previous tab
      newTabGroupIndex = highlightedIndex.tabGroupIndex;
      newTabIndex = highlightedIndex.tabIndex - 1;
    } else if (highlightedIndex.tabGroupIndex > 0) {
      // if highlighted tab is not in first tabGroup
      // highlight last tab in previous tabGroup
      newTabGroupIndex = highlightedIndex.tabGroupIndex - 1;
      newTabIndex = tabGroups[newTabGroupIndex].tabs.length - 1;
    } else {
      // highlight last tab in last tabGroup
      newTabGroupIndex = tabGroups.length - 1;
      newTabIndex = tabGroups[newTabGroupIndex].tabs.length - 1;
    }

    return {
      tabGroupIndex: newTabGroupIndex,
      tabIndex: newTabIndex,
    };
  };

  highlight = ({ tabGroupIndex, tabIndex }) => {
    this.props.onChange({
      highlightedIndex: {
        tabGroupIndex,
        tabIndex,
      },
    });
  };

  keyHandlers = {
    down: event => {
      this.highlight(this.getNextIndex());
      event.preventDefault();
    },

    up: event => {
      this.highlight(this.getPrevIndex());
      event.preventDefault();
    },

    tab: event => {
      this.highlight(this.getNextIndex());
      event.preventDefault();
    },

    'shift+tab': event => {
      this.highlight(this.getPrevIndex());
      event.preventDefault();
    },
  };

  render() {
    return this.props.children({
      highlightedIndex: this.props.highlightedIndex,
      highlight: this.highlight,
    });
  }
}

export default Hightlighter;
