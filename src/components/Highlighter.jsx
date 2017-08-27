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
    Mousetrap.prototype.stopCallback = () => false;

    Object.keys(this.keyHandlers).forEach(key => {
      Mousetrap.bind(key, this.keyHandlers[key]);
    });
  }

  componentDidUpdate(prevProps) {
    const { highlightedIndex } = this.props;

    if (prevProps.highlightedIndex === highlightedIndex) return;

    const highlightedNode = document.getElementById(highlightedIndex);

    this.scrollIntoView(highlightedNode, this.rootNode);
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  getRootProps = ({ refKey = 'ref', ...props } = {}) => ({
    ...props,
    [refKey]: this.rootRef,
  });

  getItemProps = ({ item, index, ...props }) => {
    this.items[index] = item;

    return {
      ...props,
      id: index,
      onMouseEnter: () => this.changeHighlightedIndex(index),
      onClick: () => this.selectItem(item),
    };
  };

  rootRef = node => {
    this.rootNode = node;
  };

  scrollIntoView = (node, rootNode) => {
    const rootStyle = getComputedStyle(rootNode);
    const rootPaddingTop = parseInt(
      rootStyle.getPropertyValue('padding-top'),
      10,
    );
    const rootPaddingBottom = parseInt(
      rootStyle.getPropertyValue('padding-bottom'),
      10,
    );

    const viewTop = rootNode.scrollTop;
    const viewBottom = viewTop + rootNode.getBoundingClientRect().height;

    const nodeTop = node.offsetTop - rootNode.offsetTop;
    const nodeBottom = nodeTop + node.getBoundingClientRect().height;

    if (nodeTop < viewTop + rootPaddingTop) {
      rootNode.scrollTop += nodeTop - (viewTop + rootPaddingTop);
    }

    if (nodeBottom > viewBottom - rootPaddingBottom) {
      rootNode.scrollTop += nodeBottom - (viewBottom - rootPaddingBottom);
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
      getRootProps: this.getRootProps,
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
