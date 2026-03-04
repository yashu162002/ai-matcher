import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Intro from "./pages/Intro";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Resumes from "./pages/Resumes";
import Layout from "./components/Layout";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/landing" replace />;
  return children;
}

export default function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Intro Screen (First Page) */}
        <Route path="/" element={<Intro />} />

        {/* Landing Page */}
        <Route path="/landing" element={<Landing />} />

        {/* Protected Recruiter Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="job/:jobId" element={<JobDetails />} />
          <Route path="resumes" element={<Resumes />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}