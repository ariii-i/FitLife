import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useChartStore } from "@/entities/workout/modal/chart-store";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardButton } from "@/widget/layout/dashboard-button";
import { auth } from "@/shared/lib/firebase";

const get_today_date = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const WorkoutHistoryChartPage = () => {
  const { date } = useParams<{ date: string }>();
  const { chartData, loading, error, fetch_chart_data } = useChartStore();

  const effectiveDate = date || get_today_date();

  useEffect(() => {
    fetch_chart_data(auth.currentUser?.uid || "", effectiveDate);
  }, [effectiveDate, fetch_chart_data]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Error: {error}</p>
        <Link to="/">
          <Button variant="link" className="mt-2">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-400">
          No workout data found for {effectiveDate}
        </p>

        <DashboardButton />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 ">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Workout History - {effectiveDate}
        </h1>
        <Link to="/">
          <Button variant="link">Back to Home</Button>
        </Link>
      </div>

      {chartData.map((workout) => (
        <div key={workout.workout_id} className="space-y-4">
          <h2 className="text-xl font-semibold">{workout.workout_name}</h2>
          <div className="h-80 bg-gray-800 rounded-lg p-4 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={workout.exercises_data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="exercise_name"
                  stroke="#888"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line
                  dataKey="planned_sets"
                  stroke="orange"
                  strokeDasharray="5 5"
                  name="Planned Sets"
                  connectNulls={false}
                />
                <Line
                  strokeDasharray="5 5"
                  dataKey="planned_reps"
                  stroke="blue"
                  name="Planned Reps"
                  connectNulls={false}
                />
                <Line
                  dataKey="actual_sets"
                  stroke="green"
                  name="Actual Sets"
                  connectNulls={false}
                />
                <Line
                  dataKey="actual_reps"
                  stroke="red"
                  name="Actual Reps"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
};
