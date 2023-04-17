import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Top from "./components/Top";
import Header from "./components/Header";
import AddItem from "./components/AddItem";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/addItem" element={<AddItem />} />
      </Routes>
    </Router>
  );
}

export default App;
