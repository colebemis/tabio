import { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';

class Highlighter extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    highlightedIndex: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const highlightedNode = document.getElementById(
      this.props.highlightedIndex,
    );

    this.scrollTo(highlightedNode, this.containerNode);

    // set up key handlers
    Mousetrap.prototype.stopCallback = () => false;

    Object.keys(this.keyHandlers).forEach(key => {
      Mousetrap.bind(key, this.keyHandlers[key]);
    });
  }

  componentDidUpdate(prevProps) {
    const { highlightedIndex } = this.props;

    if (prevProps.highlightedIndex === highlightedIndex) return;

    const highlightedNode = document.getElementById(highlightedIndex);

    if (highlightedNode) {
      this.scrollTo(highlightedNode, this.containerNode);
    }
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  setContainerRef = node => {
    this.containerNode = node;
  };

  getContainerProps = ({ refKey = 'ref' } = {}) => ({
    [refKey]: this.setContainerRef,
  });

  getItemProps = ({ item, index }) => {
    this.items[index] = item;

    return {
      id: index,
      onMouseEnter: () => this.changeHighlightedIndex(index),
      onClick: () => this.selectItem(item),
    };
  };

  scrollTo = (itemNode, containerNode) => {
    const containerStyle = getComputedStyle(containerNode);
    const containerPaddingTop = parseInt(
      containerStyle.getPropertyValue('padding-top'),
      10,
    );
    const containerPaddingBottom = parseInt(
      containerStyle.getPropertyValue('padding-bottom'),
      10,
    );

    const containerRect = containerNode.getBoundingClientRect();
    const itemRect = itemNode.getBoundingClientRect();

    if (itemRect.top < containerRect.top + containerPaddingTop) {
      containerNode.scrollTop +=
        itemRect.top - (containerRect.top + containerPaddingTop);
    }

    if (itemRect.bottom > containerRect.bottom - containerPaddingBottom) {
      containerNode.scrollTop +=
        itemRect.bottom - (containerRect.bottom - containerPaddingBottom);
    }
  };

  changeHighlightedIndex = highlightedIndex => {
    this.props.onChange(highlightedIndex);
  };

  moveHighlightedIndex = amount => {
    const { highlightedIndex } = this.props;

    let newIndex = (highlightedIndex + amount) % this.items.length;

    if (newIndex < 0) {
      newIndex += this.items.length;
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
      // prop getters
      getContainerProps: this.getContainerProps,
      getItemProps: this.getItemProps,

      // state
      highlightedIndex: this.props.highlightedIndex,

      // actions
      changeHighlightedIndex: this.changeHighlightedIndex,
      selectItem: this.selectItem,
      removeItem: this.removeItem,
    });
  }
}

export default Highlighter;
