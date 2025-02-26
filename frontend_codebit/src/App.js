import './App.css';
import React from 'react';

import SignupCard from './pages/SignupCard';
import SigninCard from './pages/SigninCard';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import {  Routes, Route } from 'react-router-dom';
import CodeRunner from './pages/Editor';
import ProblemPractice from './pages/ProblemPractice';
import Layout from './components/Layout';
import ProblemSet from './pages/ProblemSet';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Contest from './pages/contest';
import { Sheet } from './components/Sheet';
function App() {
 
  return (
 

    
      <Routes>
        {/* Wrap all pages inside Layout (so Navbar is always there) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="editor" element={<CodeRunner />} />
          <Route path="problem-practice/:title" element={<ProblemPractice />} />
         <Route path='contest' element={<ProtectedRoute><Contest/>  </ProtectedRoute> }/>
         <Route path='profile' element={ <ProtectedRoute><Profile/></ProtectedRoute> }/>
         <Route path='/problem-set' element={<ProblemSet/>}/>


         <Route path='posts' element={<Post/>}></Route>
        </Route>
    <Route path='/sign-in' element={<SigninCard />}/>
    <Route path='/sign-up' element={<SignupCard />}/>
    <Route path='/sheet' element={<Sheet />}/>
    {/* <Route path='*' element={<h1>404 Not Found</h1>} /> */}
  </Routes>

  );
}
export default App;