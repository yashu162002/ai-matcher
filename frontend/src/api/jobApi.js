import axios from "axios";

const API = "http://localhost:8083/api/job";

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
