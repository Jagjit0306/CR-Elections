import './App.css';

import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

import Login from './pages/login';
import Vote from './pages/vote';

function App() {

  return (
    <div
      className='App'
    >
        <Routes>
          <Route path='/' element={<Login/>} ></Route>
          <Route path='/vote' element={<Vote/>} ></Route>
        </Routes>
    </div>
  );
}

export default App;
