import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Candidate from "./pages/candidates/candidates.jsx";
import EmployeesPage from "./pages/Employees/EmployeesPage.jsx";
import AttendancePage from "./pages/Attendance/AttendancePage.jsx";
import LeavesPage from "./pages/Leaves/LeavesPage.jsx";
function App() {
  // const isAuthenticated = false;
   const isAuthenticated = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/candidates" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/candidates" element={<Candidate />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leaves" element={<LeavesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
