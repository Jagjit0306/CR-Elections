import './App.css';

import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import Login from './pages/login';
import Vote from './pages/vote';
import Result from './pages/result';

function App() {

  function NF() {
    const navigate = useNavigate()
    useEffect(()=>{
      navigate('/')
    })
  }

  return (
    <div
      className='App'
    >
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/vote' element={<Vote/>} />
        <Route path='/result' element={<Result/>} />
        <Route path='*' element={<NF/>} />
      </Routes>
    </div>
  );
}

export default App;
