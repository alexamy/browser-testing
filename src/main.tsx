// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { TestsUI } from './App/TestsUI';
import { StrictMode } from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestsUI />
  </StrictMode>
);
