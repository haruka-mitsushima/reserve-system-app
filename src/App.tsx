import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Top from './components/Top/Top';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import AddItem from './components/Management/AddItem';
import Reserve from './components/Reserve/Reserve';
import { Completed } from './components/Reserve/Completed';
import MyPage from './components/MyPage';
import { ItemPage } from './components/Items/ItemPage';
import Edit from './components/Reserve/Edit';
import EditItem from './components/Management/EditItem';
import ManagementTop from './components/Management/ManagementTop';
import NewEditItem from './components/Management/NewEditItem';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route
          path="/reserve/edit/:id"
          element={
            <Suspense fallback={<p>Loading...</p>}>
              <Edit />
            </Suspense>
          }
        />
        <Route path="/manage" element={<ManagementTop />} />
        <Route path="/manage/addItem" element={<AddItem />} />
        <Route path="/manage/editItem" element={<NewEditItem />} />
        <Route
          path="/manage/editItem/:id"
          element={
            <Suspense fallback={<p>Loading...</p>}>
              <EditItem />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
