import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const propTypes = {
  tab: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    favIconUrl: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool,
  isHighlighted: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
};

const defaultProps = {
  isActive: false,
  isHighlighted: false,
  onMouseEnter: () => {},
  onClick: () => {},
  onRemove: () => {},
};

const Container = glamorous.div(
  {
    display: 'flex',
    alignItems: 'center',
    height: 40,
    padding: '0 6px',
    borderRadius: 3,
    cursor: 'pointer',
    userSelect: 'none',
  },
  ({ isActive, theme }) =>
    isActive && {
      color: theme.primaryColor,
    },
  ({ isHighlighted, theme }) =>
    isHighlighted && {
      color: theme.highlightedTextColor,
      backgroundColor: theme.primaryColor,
    },
);

const FavIcon = glamorous.span({
  flex: '0 0 auto',
  boxSizing: 'content-box',
  width: 16,
  height: 16,
  padding: 3,
  margin: 3,
  backgroundColor: '#FFFFFF',
  borderRadius: 3,
});

const Title = glamorous.span({
  flex: '1 1 auto',
  margin: '0 6px',
  fontSize: 14,
  lineHeight: '40px',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
});

const CloseIcon = glamorous('svg', { withProps: { viewBox: '0 0 16 16' } })(
  {
    flex: '0 0 auto',
    display: 'none',
    boxSizing: 'content-box',
    width: 16,
    height: 16,
    margin: 3,
    padding: 3,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round',
    borderRadius: 3,

    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  },
  ({ isHighlighted }) =>
    isHighlighted && {
      display: 'block',
    },
);

const favIconPlaceholder = (
  <svg viewBox="0 0 16 16" fill="none" stroke="#5A5A5A" strokeWidth="1">
    <polygon points="3.5,1.5 8.5,1.5 12.5,5.5 12.5,14.5 3.5,14.5" />
    <polyline points="8.5,1.5 8.5,5.5 12.5,5.5" />
  </svg>
);

function Tab({ tab, isHighlighted, onRemove, ...props }) {
  return (
    <Container isHighlighted={isHighlighted} {...props}>
      <FavIcon>
        {/^(https?:\/\/|data:image)/.test(tab.favIconUrl) ? (
          <img src={tab.favIconUrl} alt="" width="100%" height="100%" />
        ) : (
          favIconPlaceholder
        )}
      </FavIcon>
      <Title>{tab.title}</Title>
      <CloseIcon
        isHighlighted={isHighlighted}
        onClick={event => {
          onRemove();
          event.stopPropagation();
        }}
      >
        <line x1="3" y1="3" x2="13" y2="13" />
        <line x1="13" y1="3" x2="3" y2="13" />
      </CloseIcon>
    </Container>
  );
}

Tab.propTypes = propTypes;
Tab.defaultProps = defaultProps;

export default Tab;
