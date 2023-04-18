import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Top from './components/Top/Top';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import AddItem from './components/AddItem';
import Reserve from './components/Reserve/Reserve';
import { Completed } from './components/Reserve/Completed';
import { ItemPage } from './components/Items/ItemPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addItem" element={<AddItem />} />
        <Route path="/completed/:id" element={<Completed />} />
        <Route path="/item" element={<ItemPage />} />
      </Routes>
    </Router>
  );
}

export default App;
