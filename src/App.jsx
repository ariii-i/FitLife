import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { LoginPage } from './pages/login';
import { HomePage } from './pages/home';
import { Exercise } from './pages/exercise';
import { Workout } from './pages/workout';
import { Profile } from './pages/profile';
import { WorkoutDetails } from '../src/widget/exercise/list';
// import { SessionPage } from './pages/home/session';
import { StopExercise } from './features/stop-exercise/ui';
import { SessionPage } from './features/start-exercise/ui';
import { Layout } from './widget/layout';
import { WorkoutHistory } from './widget/workout/workout-history';
import { ProtectedRoute } from './features/auth/protected-route';

function App() {
  return (
    <div className="max-w-screen-md mx-auto">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/workoutHistory/:workoutLogId" element={<WorkoutHistory />} />
            <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
            {/* <Route path="/workout/:workoutId/session" element={<SessionPage />} /> */}
            <Route path="/workout/:workoutId/session/:exerciseId" element={<SessionPage />} />
            <Route path="/workout/:workoutId/session/:exerciseId" element={<StopExercise />} />
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
