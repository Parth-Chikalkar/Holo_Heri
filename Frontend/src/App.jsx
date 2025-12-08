import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SitesPage from './Pages/SitesPage'
import HoloPage from './Pages/HoloPage'
import '@google/model-viewer';
function App() {
  return (
    <Routes>
     <Route path='/' element={<HomePage/>}/>
     <Route path='/sites' element={<SitesPage/>}/>
     <Route path='/viewer/:id' element={<HoloPage/>}/>

    </Routes>
  )
}

export default App