import React, { useRef, useEffect } from 'react';
import useRandomizeText from './useRandomizeText';

const RandomizeText = ({ initialText, delay, resetDelay }) => {
  const targetRef = useRef();
  const { randomizeText } = useRandomizeText(initialText, delay, resetDelay);

  useEffect(() => {
    const target = targetRef.current;
    if (target) {
      randomizeText(target);
    }
  }, [randomizeText]);

  return <div className='text-5xl' ref={targetRef}>{initialText}</div>;
};

export default RandomizeText;
