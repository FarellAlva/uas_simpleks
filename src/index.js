import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style.css';    // pastikan path CSS sesuai dengan letak file Anda
import App from './App';         // pastikan App.jsx berada di src/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
