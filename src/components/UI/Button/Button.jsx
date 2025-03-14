import { variant } from '../../../common/button-const';

export default function Button({ btnStyle = 'default', onClick, children }) {
  return (
    <button className={variant[btnStyle]} onClick={onClick || (() => {})}>
      {children}
    </button>
  );
}
