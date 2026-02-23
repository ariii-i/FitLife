import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/login';
import { Layout } from './widget/header/layout';
import { HomePage } from './pages/home';
import { Exercise } from './pages/exercise';
import { Workout } from './pages/workout';
import { Profile } from './pages/profile';
import { WorkoutDetails } from './pages/home/details';
import { SessionPage } from './pages/home/session';

function App() {
  return (
    <div className="max-w-screen-md mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/:workoutId" element={<WorkoutDetails />} />
            <Route path="/:workoutId/:session/sessionId" element={<SessionPage />} />
            <Route path="/exercise" element={<Exercise />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
