import React from 'react'
import Table from './Table'
import Login from './Authentication/Login'
import {BrowserRouter,Route,Routes} from "react-router-dom";
import { AuthProvider } from './Context/authContext';
const App = () => {
  return(

    <AuthProvider>
    <BrowserRouter>
    <Routes>
      <Route path='/table' element={<Table></Table>}></Route>
      <Route path='/' element={<Login></Login>}></Route>
    </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App