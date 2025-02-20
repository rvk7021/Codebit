import './App.css';
import React from 'react';
import  SignupCard from './pages/SignupCard';
import SigninCard from './pages/SigninCard';
import Home from './pages/Home';
import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import {ProtectedRoute} from './components/ProtectedRoute';
import Navbar from './components/Navbar';
function App() {
  return (
    <BrowserRouter>


  {/* <Header/> */}
  <Routes>
 
    <Route path='/' element={<Home />}/>
    <Route path='/sign-in' element={<SigninCard />}/>
    <Route path='/sign-up' element={<SignupCard />}/>
    <Route path='/dashboard' element={<Navbar/>}/>
    {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
   
  </Routes>
  </BrowserRouter>
  );
}

export default App;
