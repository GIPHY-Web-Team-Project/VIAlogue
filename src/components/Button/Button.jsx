import { useEffect, useState } from 'react';

export default function Button(props) {
  const [variant, setVariant] = useState('py-2 px-4 text-white bg-dark-blue rounded-lg cursor-pointer transition hover:bg-blue hover:text-black');

  useEffect(() => {
    switch (props.type) {
      case 'login':
        setVariant('border-4 border-dark-blue rounded-lg py-1 px-2 hover:text-black hover:bg-blue hover:border-blue cursor-pointer transition');
        break;
      case 'text-button':
        setVariant('text-blue-500 cursor-pointer hover:underline');
        break;
      case 'get-started':
        setVariant('m-1 text-2xl p-6 bg-dark-blue rounded-lg hover:bg-blue hover:text-black hover:cursor-pointer transition');
        break;
    }
  }, [props.type]);

  return (
    <button className={variant} onClick={props.onClick || (() => {})}>
      {props.children}
    </button>
  );
}
