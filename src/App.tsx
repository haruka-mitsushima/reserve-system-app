import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Top from "./components/Top";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Top />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
