import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import Panel from './pages/Panel'
import Travels from './pages/Travels'
import Travellers from './pages/Travellers'
import Users from './pages/Users'
import Statistics from './pages/Statistics'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} exact></Route>
          <Route path="/admin-panel" element={<Panel />} exact></Route>
          <Route path="/travels" element={<Travels />} exact></Route>
          <Route path="/travellers" element={<Travellers />} exact></Route>
          <Route path="/users" element={<Users />} exact></Route>
          <Route path="/statistics" element={<Statistics />} exact></Route>
        </Routes>
      </Router> 
    </> 
  )
}


export default App
