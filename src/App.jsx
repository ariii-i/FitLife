import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Workouts } from './pages/Workouts';
import { Exercises } from './pages/Exercises';
import { Progress } from './pages/Progress';
import { Login } from './pages/Login';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App
