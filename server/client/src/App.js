import './App.css';

import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';

import Login from './pages/login';

function App() {

  return (
    <div
      className='App'
    >
        <Routes>
          <Route path='/' element={<Login/>} ></Route>
        </Routes>
    </div>
  );
}

export default App;
