import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { PublicClientApplication } from '@azure/msal-browser';

//config for public client application
const config = {
  auth: {
    clientId: 'b9bed8e4-536f-4e7d-92c3-4da1ecfdcad9',
    authority: 'https://login.microsoftonline.com/5de2f7e1-9a25-4339-a06e-590727e6933c',
    redirectUri: '/' //'http://localhost:3000/dashboard'
  }
};

const pca = new PublicClientApplication(config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App msalInstance={pca} />
  </React.StrictMode>
);


