import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { EventType, PublicClientApplication } from '@azure/msal-browser';

//config for public client application
const config = {
  auth: {
    clientId: 'b9bed8e4-536f-4e7d-92c3-4da1ecfdcad9',
    authority: 'https://login.microsoftonline.com/5de2f7e1-9a25-4339-a06e-590727e6933c',
    redirectUri: '/' //'http://localhost:3000/dashboard'
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

const pca = new PublicClientApplication(config);

pca.addEventCallback(event => {
  if(event.eventType === EventType.LOGIN_SUCCESS)
    if(event){
      console.log(event);
      pca.setActiveAccount(event.payload.account);
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App msalInstance={pca} />
  </React.StrictMode>
);


