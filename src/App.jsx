import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DummyLoginPage from "./pages/DummyLoginPage";
import InstructionsPage from "./pages/InstructionsPage";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import { AuthProvider } from "./context/AuthContext";
import { TestProvider } from "./context/TestContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TestProvider>
          <Routes>
            {/* The REAL login page */}
            <Route path="/login" element={<LoginPage />} />

            {/* Application core routes are protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dummylogin/:quizId"
              element={
                <ProtectedRoute>
                  <DummyLoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructions/:quizId"
              element={
                <ProtectedRoute>
                  <InstructionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test/:quizId"
              element={
                <ProtectedRoute>
                  <TestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results/:attemptId"
              element={
                <ProtectedRoute>
                  <ResultsPage />
                </ProtectedRoute>
              }
            />

            {/* Redirect any other path to the home page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </TestProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
