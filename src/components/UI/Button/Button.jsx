import { variant } from '../../../common/button-const';
import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ btnStyle = 'default', onClick, children }) {
  return (
    <button className={variant[btnStyle]} onClick={onClick || (() => {})}>
      {children}
    </button>
  );
}

Button.propTypes = {
  btnStyle: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
