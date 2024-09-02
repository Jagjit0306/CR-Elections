import './App.css';

import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from 'react';

import Login from './pages/login';
import Vote from './pages/vote';

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
          <Route path='/' element={<Login/>} ></Route>
          <Route path='/vote' element={<Vote/>} ></Route>
          <Route path='*' element={<NF/>} />
        </Routes>
    </div>
  );
}

export default App;
