import './App.css';
import React from 'react';
import  SignupCard from './pages/SignupCard';
import SigninCard from './pages/SigninCard';
import Home from './pages/Home';
import { BrowserRouter ,Routes,Route} from 'react-router-dom'
// import {ProtectedRoute} from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';



function App() {
  return (
    <BrowserRouter>


  {/* <Header/> */}
  <Routes>
 
    <Route path='/' element={<Home />}/>
    <Route path='/profile' element={<Profile />}/>
    <Route path='/sign-in' element={<SigninCard />}/>
    <Route path='/sign-up' element={<SignupCard />}/>
    <Route path='/dashboard' element={<Navbar/>}/>
  </Routes>
  </BrowserRouter>
  );
}

export default App;
