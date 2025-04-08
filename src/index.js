import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Admin from './Admin';
import Produto from './Produto';
import Login from './Login';
import AdicionarEstoque from './AdicionarEstoque';
import './index.css';
import Dashboard from './Dashboard';
import Clientes from './Clientes';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/estoque" element={<AdicionarEstoque />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
