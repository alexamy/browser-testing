import { useEffect } from 'react';
import s from './body.module.css';

/** Add class to a body element. */
export function useBodyStyle(className: string) {
  useEffect(() => {
    document.body.classList.add(s[className]);
  }, [className]);
}
