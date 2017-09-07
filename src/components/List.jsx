import React from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import { Div } from 'glamorous';

class List extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.any).isRequired,
    highlightedIndex: PropTypes.number.isRequired,
    renderItem: PropTypes.func.isRequired,
    style: PropTypes.objectOf(PropTypes.any),
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    style: {},
  };

  componentDidMount() {
    const highlightedNode = this.containerElement.children[
      this.props.highlightedIndex
    ];

    this.scrollToItem(highlightedNode, this.containerElement);

    // set up key handlers
    Mousetrap.prototype.stopCallback = () => false;

    Object.keys(this.keyHandlers).forEach(key => {
      Mousetrap.bind(key, this.keyHandlers[key]);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.highlightedIndex === this.props.highlightedIndex) return;

    if (this.containerElement.children.length > 0) {
      const highlightedNode = this.containerElement.children[
        this.props.highlightedIndex
      ];

      this.scrollToItem(highlightedNode, this.containerElement);
    }
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  setContainerRef = node => {
    this.containerElement = node;
  };

  scrollToItem = (itemElement, containerElement) => {
    const containerStyle = getComputedStyle(containerElement);
    const containerPaddingTop = parseInt(
      containerStyle.getPropertyValue('padding-top'),
      10,
    );
    const containerPaddingBottom = parseInt(
      containerStyle.getPropertyValue('padding-bottom'),
      10,
    );

    const containerRect = containerElement.getBoundingClientRect();
    const itemRect = itemElement.getBoundingClientRect();

    if (itemRect.top < containerRect.top + containerPaddingTop) {
      containerElement.scrollTop +=
        itemRect.top - (containerRect.top + containerPaddingTop);
    }

    if (itemRect.bottom > containerRect.bottom - containerPaddingBottom) {
      containerElement.scrollTop +=
        itemRect.bottom - (containerRect.bottom - containerPaddingBottom);
    }
  };

  changeHighlightedIndex = highlightedIndex => {
    this.props.onChange(highlightedIndex);
  };

  moveHighlightedIndex = amount => {
    let newIndex =
      (this.props.highlightedIndex + amount) % this.props.data.length;

    if (newIndex < 0) {
      newIndex += this.props.data.length;
    }

    this.changeHighlightedIndex(newIndex);
  };

  selectItem = item => {
    this.props.onSelect(item);
  };

  selectHighlightedItem = () => {
    if (this.props.data.length === 0) return;

    this.selectItem(this.props.data[this.props.highlightedIndex]);
  };

  removeItem = (item, index) => {
    if (index === this.props.data.length - 1) {
      this.changeHighlightedIndex(index - 1);
    }

    this.props.onRemove(item);
  };

  removeHighlightedItem = () => {
    if (this.props.data.length === 0) return;

    this.removeItem(
      this.props.data[this.props.highlightedIndex],
      this.props.highlightedIndex,
    );
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
    return (
      <Div
        innerRef={this.setContainerRef}
        css={this.props.style}
        overflowY="auto"
      >
        {this.props.data.map((item, index) =>
          this.props.renderItem({
            // state
            item,
            index,
            highlightedIndex: this.props.highlightedIndex,

            // actions
            changeHighlightedIndex: this.changeHighlightedIndex,
            selectItem: this.selectItem,
            removeItem: this.removeItem,
          }),
        )}
      </Div>
    );
  }
}

export default List;
