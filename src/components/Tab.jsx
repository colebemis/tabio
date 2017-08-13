import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const textStyle = {
  margin: '0 8px',
  fontSize: 14,
  lineHeight: '48px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const Container = glamorous.li(({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  height: 48,
  padding: '0 8px',
  background: selected ? '#0C77F8' : 'transparent',
  borderRadius: 4,
  color: selected ? '#FFF' : 'currentColor',
  cursor: 'pointer',
}));

const FavIcon = glamorous.span({
  flex: '0 0 auto',
  width: 16,
  height: 16,
  margin: 4,
  padding: 4,
  borderRadius: 4,
  backgroundColor: '#FFF',

  boxSizing: 'content-box',
});

const Title = glamorous.span(textStyle);

const Url = glamorous.span(textStyle, ({ selected }) => ({
  flex: '1 0 auto',
  opacity: selected ? 0.7 : 0.5,
}));

const Close = glamorous.svg(({ selected }) => ({
  flex: '0 0 auto',
  boxSizing: 'content-box',
  display: selected ? 'block' : 'none',
  width: 16,
  height: 16,
  margin: 4,
  padding: 4,
  stroke: 'currentColor',
  strokeWidth: 1,
  borderRadius: 4,
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
}));

const favIconPlaceholder = (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect x="0" y="0" width="16" height="16" fill="black" />
  </svg>
);

const Tab = ({
  favIconUrl,
  title,
  url,
  selected,
  selectTab,
  goToTab,
  closeTab,
}) =>
  <Container onClick={goToTab} onMouseOver={selectTab} selected={selected}>
    <FavIcon>
      {/^https?:\/\//.test(favIconUrl)
        ? <img src={favIconUrl} alt="FavIcon" width="16" height="16" />
        : favIconPlaceholder}
    </FavIcon>
    <Title>
      {title === '' ? 'Untitled' : title}
    </Title>
    <Url selected={selected}>
      {url.split('/')[2]}
    </Url>
    <Close selected={selected} viewBox="0 0 16 16" onClick={closeTab}>
      <path d="M 3 3, l 10 10 M 13 3 l -10 10" />
    </Close>
  </Container>;

Tab.propTypes = {
  favIconUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  goToTab: PropTypes.func.isRequired,
  closeTab: PropTypes.func.isRequired,
};

Tab.defaultProps = {
  favIconUrl: '',
};

export default Tab;
