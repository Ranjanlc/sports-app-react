import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { FootballContextProvider } from './store/football-context';
import { CompetitionContextProvider } from './store/competition-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <FootballContextProvider>
    <CompetitionContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CompetitionContextProvider>
  </FootballContextProvider>
  // </React.StrictMode>
);
