  import React from 'react'
  import { Route, Routes } from 'react-router-dom'
  import HomePage from './Pages/HomePage'
  import SitesPage from './Pages/SitesPage'
  import HoloPage from './Pages/HoloPage'

  import '@google/model-viewer';
  import ProtectedRoute from './Components/ProtectedRoute'
  import UploadPage from './Pages/UploadPage'
  function App() {
    return (
      <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/sites' element={<SitesPage/>}/>
      <Route path='/viewer/:id' element={<HoloPage/>}/>
      <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<UploadPage />} />
        
        </Route>

      </Routes>
    )
  }

  export default App