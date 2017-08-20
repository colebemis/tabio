import { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

const propTypes = {
  children: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number.isRequired,
  listSize: PropTypes.number.isRequired,
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

  changeHighlightedIndex = highlightedIndex => {
    this.props.onChange(highlightedIndex);
  };

  moveHighlightedIndex = amount => {
    const { highlightedIndex, listSize } = this.props;
    // TODO: figure out a better algorithm for this
    const newIndex = (highlightedIndex + amount + listSize) % listSize;
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
    return this.props.children({
      highlightedIndex: this.props.highlightedIndex,
      changeHighlightedIndex: this.changeHighlightedIndex,
    });
  }
}

Highlighter.propTypes = propTypes;

export default Highlighter;
