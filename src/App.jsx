import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardPage from './pages/DashboardPage';
import HomePage from "./pages/HomePage";
import HistoryPage from './pages/HistoryPage';
import LoginPage from "./pages/LoginPage";
import DummyLoginPage from "./pages/DummyLoginPage";
import InstructionsPage from "./pages/InstructionsPage";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import { AuthProvider } from "./context/AuthContext";
import { TestProvider } from "./context/TestContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PlaylistPage from './pages/PlaylistPage';
import VideoListPage from './pages/VideoListPage';
import PlayerPage from './pages/PlayerPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TestProvider>
          <Routes>
            {/* The REAL login page */}
            <Route path="/login" element={<LoginPage />} />

            {/* Application core routes are protected */}
         <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/new-test" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><PlaylistPage /></ProtectedRoute>} />
            <Route path="/library/playlist/:playlistId" element={<ProtectedRoute><VideoListPage /></ProtectedRoute>} />
            <Route path="/video/:videoId" element={<ProtectedRoute><PlayerPage /></ProtectedRoute>} />
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
