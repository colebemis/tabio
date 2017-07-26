import React from 'react';
import PropTypes from 'prop-types';

const Tab = ({ favIconUrl, title, url }) =>
  <li>
    <img src={favIconUrl} alt="Favicon" />
    <span>
      {title}
    </span>
    <span>
      {url}
    </span>
  </li>;

Tab.propTypes = {
  favIconUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Tab;
