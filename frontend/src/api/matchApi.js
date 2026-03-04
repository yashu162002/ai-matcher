import axios from "axios";

const API = "http://localhost:8084/api/match";

export const getAIMatch = (jobId) =>
  axios.post(`${API}/ai/${jobId}`);

export const getRecommendedJobs = (email) =>
  axios.get(`${API}/recommend?email=${encodeURIComponent(email)}`);
