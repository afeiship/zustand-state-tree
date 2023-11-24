// import React from 'react';
import ReactDOM from 'react-dom/client';
import '@jswork/next'
import ZstateTree from '@jswork/zustand-state-tree';
import stores from './stores';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ZstateTree stores={stores}>
    <App />
  </ZstateTree>
);
