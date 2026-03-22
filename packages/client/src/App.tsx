import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/login";
import { HomePage } from "./pages/home";
import { Exercise } from "./pages/exercise/ui";
import { Workout } from "./pages/workout";
import { Profile } from "./pages/profile";
import { Layout } from "./widget/layout";
import { ProtectedRoute } from "./features/auth/protected-route";
import { WorkoutHistory } from "./widget/workout/workout-history";
import { SessionPage } from "./features/start-exercise/ui";
import { WorkoutDetails } from "./widget/exercise/exercise-detail";

function App() {
  return (
    <div className=" bg-gray-900 text-gray-100 h-screen">
      <div className="max-w-7xl mx-auto h-full">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route
                path="/workoutHistory/:workoutLogId"
                element={<WorkoutHistory />}
              />
              <Route path="/workout/:workoutId" element={<WorkoutDetails />} />
              <Route
                path="/workout/:workoutId/session/:exerciseId"
                element={<SessionPage />}
              />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
