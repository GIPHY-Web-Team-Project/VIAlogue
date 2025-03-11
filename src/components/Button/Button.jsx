import { variant } from '../../common/button-const';

export default function Button({ className = 'default', onClick, children }) {
  return (
    <button className={variant[className]} onClick={onClick || (() => {})}>
      {children}
    </button>
  );
}
