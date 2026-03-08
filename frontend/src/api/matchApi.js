import axios from "axios";

const API = "https://matching-service-7d0r.onrender.com/api/match";

export const getAIMatch = (jobId) =>
  axios.post(`${API}/ai/${jobId}`);

export const getRecommendedJobs = (email) =>
  axios.get(`${API}/recommend?email=${encodeURIComponent(email)}`);
