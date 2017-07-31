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
});

const FavIcon = glamorous.span({
  flex: '0 0 auto',
  width: 16,
  height: 16,
  margin: '0 8px',
});

const Title = glamorous.span(textStyle);

const Url = glamorous.span(textStyle, { flex: '0 0 auto' });

const favIconPlaceholder = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
  >
    <rect x="0" y="0" width="16" height="16" fill="black" />
  </svg>
);

const Tab = ({ favIconUrl, title, url, goToTab }) =>
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
  </Container>;

Tab.propTypes = {
  favIconUrl: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

Tab.defaultProps = {
  favIconUrl: '',
};

export default Tab;
