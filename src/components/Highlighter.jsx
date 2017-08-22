import { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

const propTypes = {
  children: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
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
  };

  render() {
    this.items = [];

    return this.props.children({
      getItemProps: this.getItemProps,
      highlightedIndex: this.props.highlightedIndex,
    });
  }
}

Highlighter.propTypes = propTypes;

export default Highlighter;
