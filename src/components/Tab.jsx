import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Container = glamorous.li({
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  height: 40,
  padding: 6,
});

const Favicon = glamorous.img({
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
  color: 'rgba(0, 0, 0, 0.4)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const Tab = ({ favIconUrl, title, url }) =>
  <Container>
    <Favicon src={favIconUrl} alt="Favicon" />
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
