import axios from "axios";

const API = "https://job-service-tg8t.onrender.com/api/job";

export const createJob = (job) =>
  axios.post(`${API}/create`, job);

export const getJob = (id) =>
  axios.get(`${API}/${id}`);

export const getAllJobs = () =>
  axios.get(`${API}/all`);

export const shortlistOrReject = (jobId, resumeId, status) =>
  axios.put(`${API}/${jobId}/application/${resumeId}?status=${status}`);

export const getJobApplications = (jobId) =>
  axios.get(`${API}/${jobId}/applications`);
