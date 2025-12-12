import api from "./axiosConfig";

// Search jobs with filters
export const searchJobs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.location) params.append("location", filters.location);
    if (filters.minSalary) params.append("minSalary", filters.minSalary);
    if (filters.maxSalary) params.append("maxSalary", filters.maxSalary);

    const response = await api.get(`/jobs/search?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single job details
export const getJobDetails = async (jobId) => {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Apply to a job
export const applyToJob = async (jobId) => {
  try {
    const response = await api.post("/jobs/apply", { jobId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get user's applications
export const getMyApplications = async () => {
  try {
    const response = await api.get("/applications/my-applications");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
