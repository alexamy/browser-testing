import { useEffect } from 'react';
import s from './body.module.css';

export function useBodyStyle(className: string) {
  useEffect(() => {
    document.body.classList.add(s[className]);
  }, [className]);
}
