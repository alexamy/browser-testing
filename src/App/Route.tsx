import { useEffect, useState, type JSX } from 'react';

interface RouteProps {
  path: string;
  component(): JSX.Element;
}

// https://dev.to/franciscomendes10866/create-your-own-react-router-53ng
export function Route({ path, component }: RouteProps) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    function onLocationChange() {
      setCurrentPath(window.location.pathname);
    }

    window.addEventListener('navigate', onLocationChange);

    return () => window.removeEventListener('navigate', onLocationChange);
  }, []);

  return currentPath === path ? component() : null;
}
