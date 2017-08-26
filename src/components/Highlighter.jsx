import { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

class Highlighter extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    highlightedIndex: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.any).isRequired,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  componentDidMount() {
    Mousetrap.prototype.stopCallback = () => false;

    Object.keys(this.keyHandlers).forEach(key => {
      Mousetrap.bind(key, this.keyHandlers[key]);
    });
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  keyHandlers = {
    down: event => {
      this.moveHighlightedIndex(1);
      event.preventDefault();
    },

    up: event => {
      this.moveHighlightedIndex(-1);
      event.preventDefault();
    },

    tab: event => {
      this.moveHighlightedIndex(1);
      event.preventDefault();
    },

    'shift+tab': event => {
      this.moveHighlightedIndex(-1);
      event.preventDefault();
    },

    enter: event => {
      this.selectHighlightedItem();
      event.preventDefault();
    },

    'shift+backspace': event => {
      this.removeHighlightedItem();
      event.preventDefault();
    },
  };

  changeHighlightedIndex = highlightedIndex => {
    this.props.onChange(highlightedIndex);
  };

  moveHighlightedIndex = amount => {
    const { items, highlightedIndex } = this.props;

    let newIndex = (highlightedIndex + amount) % items.length;

    if (newIndex < 0) {
      newIndex += items.length;
    }

    this.changeHighlightedIndex(newIndex);
  };

  selectItem = item => {
    this.props.onSelect(item);
  };

  selectHighlightedItem = () => {
    const { items, highlightedIndex } = this.props;

    if (items.length === 0) return;

    this.selectItem(items[highlightedIndex]);
  };

  removeItem = (item, index) => {
    const { items } = this.props;

    if (index === items.length - 1) {
      this.changeHighlightedIndex(index - 1);
    }

    this.props.onRemove(item);
  };

  removeHighlightedItem = () => {
    const { items, highlightedIndex } = this.props;

    if (items.length === 0) return;

    this.removeItem(items[highlightedIndex], highlightedIndex);
  };

  render() {
    return this.props.children({
      // state
      items: this.props.items,
      highlightedIndex: this.props.highlightedIndex,

      // actions
      changeHighlightedIndex: this.changeHighlightedIndex,
      selectItem: this.selectItem,
      removeItem: this.removeItem,
    });
  }
}

export default Highlighter;
