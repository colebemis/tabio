import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const textStyle = {
  margin: '0 8px',
  fontSize: 14,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const Container = glamorous.li({
  display: 'flex',
  alignItems: 'center',
  height: 48,
  padding: '0 8px',
  cursor: 'pointer',
});

const FavIcon = glamorous.span({
  flex: '0 0 auto',
  width: 16,
  height: 16,
  margin: '0 8px',
});

const Title = glamorous.span(textStyle);

const Url = glamorous.span(textStyle, { flex: '1 0 auto' });

const Close = glamorous.svg({
  flex: '0 0 auto',
  boxSizing: 'content-box',
  width: 16,
  height: 16,
  margin: 4,
  padding: 4,
  stroke: 'currentColor',
  strokeWidth: 1,
  borderRadius: 4,
  ':hover': {
    backgroundColor: 'lightblue',
  },
});

const favIconPlaceholder = (
  <svg width="16" height="16" viewBox="0 0 16 16">
    <rect x="0" y="0" width="16" height="16" fill="black" />
  </svg>
);

const Tab = ({ favIconUrl, title, url, goToTab, closeTab }) =>
  <Container onClick={goToTab}>
    <FavIcon>
      {/^https?:\/\//.test(favIconUrl)
        ? <img src={favIconUrl} alt="FavIcon" width="16" height="16" />
        : favIconPlaceholder}
    </FavIcon>
    <Title>
      {title === '' ? 'Untitled' : title}
    </Title>
    <Url>
      {url.split('/')[2]}
    </Url>
    <Close viewBox="0 0 16 16" onClick={closeTab}>
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
