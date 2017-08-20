import { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

const propTypes = {
  children: PropTypes.func.isRequired,
  highlightedIndex: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

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

  setHighlightedIndex = highlightedIndex => {
    this.props.onChange({ highlightedIndex });
  };

  moveHighlightedIndex = amount => {
    const { highlightedIndex, itemCount } = this.props;
    const newIndex = (highlightedIndex + amount + itemCount) % itemCount;
    this.setHighlightedIndex(newIndex);
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
      setHighlightedIndex: this.setHighlightedIndex,
    });
  }
}

Hightlighter.propTypes = propTypes;

export default Hightlighter;
