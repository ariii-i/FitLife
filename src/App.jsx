import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Workouts } from './pages/Workouts';
import { Exercises } from './pages/Exercises';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { WorkoutDetail } from './pages/WorkoutDetail';
import { Session } from './pages/Session';
import { Layout } from './components/layout/Layout';


function App() {
  return (
    <div className='max-w-screen-md h-screen mx-auto'>
      <BrowserRouter>
        <Routes >
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/workout-detail/:workoutId" element={<WorkoutDetail />} />
            <Route path="/workout-detail/:workoutId/session/:sessionId" element={<Session />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
