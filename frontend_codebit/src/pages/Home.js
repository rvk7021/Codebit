import React from 'react';
import { useEffect,useState } from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import Navbar from '../components/Navbar';
export default function Home() {
    return (
        <div>
        <Navbar/>
            <h1>Home Page</h1>
          
        </div>
    );
}