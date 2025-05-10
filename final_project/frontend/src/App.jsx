import { useState, useEffect } from 'react'
import './App.css'
import Home from './pages/Home'
import Search from './pages/Search';
import Login from './pages/Login';

import { HashRouter, Routes, Route } from 'react-router-dom';
import Groups from './pages/Groups';
import { UserProvider } from './components/UserContext';
import { CourseProvider } from './components/CourseContext';
function App() {


  return (
    <>
      <UserProvider>
        <CourseProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />

              <Route path="/groups" element={<Groups />} />
            </Routes>
          </HashRouter>
        </CourseProvider>


      </UserProvider>
    </>

  )
}

export default App
