import { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

const propTypes = {
  children: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

class Highlighter extends Component {
  componentDidMount() {
    Mousetrap.prototype.stopCallback = () => false;

    Object.keys(this.keyHandlers).forEach(key => {
      Mousetrap.bind(key, this.keyHandlers[key]);
    });
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  getItemProps = ({ item, index, ...rest }) => {
    this.items[index] = item;

    return {
      onMouseEnter: () => this.changeHighlightedIndex(index),
      onClick: () => this.selectItem(item),
      ...rest,
    };
  };

  changeHighlightedIndex = highlightedIndex => {
    this.props.onChange(highlightedIndex);
  };

  moveHighlightedIndex = amount => {
    const { highlightedIndex } = this.props;
    const listSize = this.items.length;

    let newIndex = (highlightedIndex + amount) % listSize;

    if (newIndex < 0) {
      newIndex += listSize;
    }

    this.changeHighlightedIndex(newIndex);
  };

  selectItem = item => {
    this.props.onSelect(item);
  };

  selectHighlightedItem = () => {
    if (this.items.length === 0) return;

    const { highlightedIndex } = this.props;

    this.selectItem(this.items[highlightedIndex]);
  };

  removeItem = (item, index) => {
    if (index === this.items.length - 1) {
      this.changeHighlightedIndex(index - 1);
    }

    this.props.onRemove(item);
  };

  removeHighlightedItem = () => {
    if (this.items.length === 0) return;

    const { highlightedIndex } = this.props;

    this.removeItem(this.items[highlightedIndex], highlightedIndex);
  };

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

  render() {
    this.items = [];

    return this.props.children({
      // state
      highlightedIndex: this.props.highlightedIndex,

      // prop getters
      getItemProps: this.getItemProps,

      // actions
      changeHighlightedIndex: this.changeHighlightedIndex,
      selectItem: this.selectItem,
      removeItem: this.removeItem,
    });
  }
}

Highlighter.propTypes = propTypes;

export default Highlighter;
