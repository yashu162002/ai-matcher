import axios from "axios";

const BASE_URL = "http://localhost:8082/api/resume";

export const getAllResumes = () =>
  axios.get(`${BASE_URL}/all`);

export const uploadResume = (formData) =>
  axios.post(`${BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getResumeDownloadUrl = (id) =>
  `${BASE_URL}/download/${id}`;
