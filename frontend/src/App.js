import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Web3Provider } from "./web3/Web3Context";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AddBlock from "./pages/AddBlock";
import Verify from "./pages/Verify";
import RiskMonitor from "./pages/RiskMonitor";
import Login from "./pages/Login";
import BlockDetails from "./pages/BlockDetails";
import UserManagement from "./pages/UserManagement";
import Analytics from "./pages/Analytics";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <Navbar />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddBlock />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <ProtectedRoute>
                <Verify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risk"
            element={
              <ProtectedRoute>
                <RiskMonitor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/block/:id"
            element={
              <ProtectedRoute>
                <BlockDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
        <footer className="footer">
          © 2026 Yudhveer Sharma | SecureChain - Blockchain Audit System
        </footer>
        </Web3Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;