import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Container = glamorous.li({
  display: 'flex',
  alignItems: 'center',
  height: 40,
  padding: 6,
});

const FavIcon = glamorous.span({
  flex: '0 0 auto',
  width: 16,
  height: 16,
  margin: '0 6px',
});

const Title = glamorous.span({
  margin: '0 6px',
  fontSize: 14,
  lineHeight: 1.5,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const Url = glamorous.span({
  flex: '0 0 auto',
  margin: '0 6px',
  fontSize: 14,
  lineHeight: 1.5,
  color: 'rgba(0, 0, 0, 0.5)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

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

const Tab = ({ favIconUrl, title, url }) =>
  <Container>
    <FavIcon>
      {/^https?:\/\//.test(favIconUrl)
        ? <img src={favIconUrl} alt="FavIcon" width="16" height="16" />
        : favIconPlaceholder}
    </FavIcon>
    <Title>
      {title}
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
