/**
 * author       : Applicant
 * date         : 30/03/2026
 * description  : Main App Component with Routing   
 */


import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router';
import Dashboard from './Dashboard';
import Create from './Create'
import UpdateTask from './Update';
import ViewTask from './Read'; 
import '../css/bootstrap-5.0.2-dist/css/bootstrap.min.css'; 


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Dashboard /> } />
        <Route path="/create" element={ <Create />} />
        <Route path="/dashboard" element= { <Dashboard />} />
        <Route path="/update/:id" element={ <UpdateTask />} />
        <Route path='/read/:id' element={<ViewTask />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;