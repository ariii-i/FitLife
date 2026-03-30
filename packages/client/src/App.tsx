import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { HomePage } from "./pages/home";
import { Exercise } from "./pages/exercise/ui";
import { Workout } from "./pages/workout";
import { Profile } from "./pages/profile";
import { Layout } from "./widget/layout";
import { ProtectedRoute } from "./features/auth/protected-route";
import { WorkoutHistory } from "./widget/workout/workout-history";
import { SessionPage } from "./pages/session-page/ui";
import "./App.css";
import { WorkoutDetail } from "./pages/workout-deital/ui";
import { WorkoutHistoryChartPage } from "./pages/workout-history-chart/ui";
import { WorkoutCompletedPage } from "./pages/workout-completed/ui";

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
              <Route
                path="/workout-history-chart/:date"
                element={<WorkoutHistoryChartPage />}
              />
              <Route path="/workout/:workoutId" element={<WorkoutDetail />} />
              <Route
                path="/workout/:workoutId/session/:exerciseId"
                element={<SessionPage />}
              />
              <Route
                path="/workout-completed"
                element={<WorkoutCompletedPage />}
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
