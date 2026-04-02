import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./features/auth/protected-route";
import { Exercise } from "./pages/exercise/ui";
import { HomePage } from "./pages/home";
import { LoginPage } from "./pages/login";
import { Profile } from "./pages/profile";
import { SessionPage } from "./pages/session-page/ui";
import { Workout } from "./pages/workout";
import { WorkoutCompletedPage } from "./pages/workout-completed/ui";
import { WorkoutDetail } from "./pages/workout-detail/ui";
import { WorkoutHistoryChartPage } from "./pages/workout-history-chart/ui";
import { Layout } from "./widget/layout";
import { WorkoutCard } from "./widget/workout/workout-list/ui/workout-card";
import { ExerciseCard } from "./widget/exercise/exercise-card";

function App() {
    return (
        <div className=" bg-gray-900 text-gray-100 h-screen max-h-screen overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full">
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            element={<ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>}
                        >
                            <Route path="/" element={<HomePage />} />
                            <Route path="/workout-history-chart/:date" element={<WorkoutHistoryChartPage />} />
                            <Route path="/session/:workoutId" element={<WorkoutDetail />} />
                            <Route path="/workout/:workoutId/:workoutName" element={<WorkoutCard />} />
                            <Route path="/session/:workoutId/current/:exerciseId" element={<SessionPage />} />
                            <Route path="/workout-completed" element={<WorkoutCompletedPage />} />
                            <Route path="/exercise" element={<Exercise />} />
                            <Route path="/exercise/:exerciseId" element={<ExerciseCard />} />
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
