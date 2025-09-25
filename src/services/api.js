// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://gate-guide-api.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// A utility function to handle the logout process from anywhere
const forceLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  // Use window.location to force a full refresh, which will reset all component states
  window.location.href = "/login";
};

// Request Interceptor: Attaches the JWT to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ***** NEW & CRITICAL: Response Interceptor *****
// This checks every failed response to see if it's an expired token.
api.interceptors.response.use(
  (response) => response, // Directly return successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401/403 and if we haven't already retried this request
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark this request as retried

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("Refresh token not found. Forcing logout.");
        forceLogout();
        return Promise.reject(error);
      }

      try {
        console.log("Access token expired. Attempting to refresh...");
        // Manually make the refresh token request to avoid an infinite loop if this also fails
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          token: refreshToken,
        });

        const { token: newAccessToken } = response.data;

        // Save the new token to local storage
        localStorage.setItem("accessToken", newAccessToken);

        console.log("Token refreshed successfully. Retrying original request.");

        // Update the header of the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error(
          "Unable to refresh token:",
          refreshError.response?.data?.message || refreshError.message
        );
        forceLogout(); // If refresh fails, the session is invalid.
        return Promise.reject(refreshError);
      }
    }

    // For any other errors, just pass them along
    return Promise.reject(error);
  }
);

// --- API Functions ---
export const generateQuiz = (options) => {
  return api.post("/quizzes/generate", options);
};

// --- THIS IS THE NEW FUNCTION FOR THE FRONTEND ---
export const generateQuizFromJson = (data) => {
  // `data` will be { subjectId, topicName, questionsData }
  return api.post("/quizzes/generate-from-json", data);
};

export const getSyllabusTree = () => {
  return api.get("/academic/syllabus-tree");
};

// --- NEW FUNCTION ---
export const getAvailableTopics = () => api.get("/knowledge/available-topics");

export const submitQuiz = (quizId, submissionData) => {
  return api.post(`/quizzes/${quizId}/submit`, submissionData);
};

export const getAttemptDetail = (attemptId) => {
  return api.get(`/quizzes/attempts/${attemptId}`);
};

// Fetches the list of all past attempts
export const getAllAttempts = () => api.get("/quizzes/attempts/all");

// Fetches a specific quiz's data (questions, etc.) for a re-attempt
export const getQuizForRetake = (quizId) => api.get(`/quizzes/${quizId}`);

// --- NEW YOUTUBE LIBRARY FUNCTIONS ---
export const getPlaylists = () => api.get("/youtube/playlists");
export const getPlaylistVideos = (playlistId) =>
  api.get(`/youtube/playlists/${playlistId}/videos`);

api.login = (credentials) => api.post("/auth/login", credentials);

export default api;
