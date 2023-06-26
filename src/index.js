import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { MatchContextProvider } from './store/match-context';
import { CompetitionContextProvider } from './store/competition-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <MatchContextProvider>
    <CompetitionContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CompetitionContextProvider>
  </MatchContextProvider>
  // </React.StrictMode>
);
