import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SitesPage from './Pages/SitesPage'
import HoloPage from './Pages/HoloPage'
import '@google/model-viewer';
import ProtectedRoute from './Components/ProtectedRoute'
import UploadPage from './Pages/UploadPage'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Terms from './Pages/Terms'
import Privacy from './Pages/Privacy'
import Careers from './Pages/Careers'
  function App() {
    return (
      <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/sites' element={<SitesPage/>}/>
      <Route path='/viewer/:id' element={<HoloPage/>}/>
      <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<UploadPage/>}/>        
        </Route>
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/terms' element={<Terms/>}/>
        <Route path='/privacy' element={<Privacy/>}/>
        <Route path='/careers' element={<Careers/>}/>
       

      </Routes>
    )
  }

  export default App