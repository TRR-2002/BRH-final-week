import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchJobs } from "../api/jobApi";

function JobSearchPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  // Fetch jobs on component mount and when filters change
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const filters = {
        keyword,
        location,
        minSalary,
        maxSalary,
      };
      const data = await searchJobs(filters);
      setJobs(data.jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.error || "Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleClearFilters = () => {
    setKeyword("");
    setLocation("");
    setMinSalary("");
    setMaxSalary("");
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header - FIXED: Button moved to opposite side */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Job Discovery
            </h1>
            <p className="text-gray-600">
              Find your next opportunity from available positions
            </p>
          </div>
          {/* FIXED: Moved button to right side, opposite of title */}
          <button
            onClick={() =>
              navigate(`/profile/view/${localStorage.getItem("userId")}`)
            }
            className="px-6 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 font-semibold transition"
          >
            Back to Profile
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Keyword Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Keywords
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, company..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or area"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Min Salary Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Salary (BDT)
                </label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  placeholder="e.g., 30000"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Max Salary Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Salary (BDT)
                </label>
                <input
                  type="number"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  placeholder="e.g., 100000"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Buttons - FIXED: Removed non-functional button, kept only functional ones */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition"
              >
                Search Jobs
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-semibold transition"
              >
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          </p>
        </div>

        {/* Job Listings - FIXED: Removed onClick from card wrapper */}
        {jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-600 mb-4">
              No jobs found matching your criteria
            </p>
            <p className="text-gray-500">
              Try adjusting your search filters or check back later for new
              opportunities
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                      {job.title}
                    </h2>
                    <p className="text-lg text-blue-600 font-semibold">
                      {job.company}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    {job.type || "Full-time"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  {job.location && (
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location}
                    </div>
                  )}
                  {(job.salaryMin || job.salaryMax) && (
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      BDT {job.salaryMin?.toLocaleString()} -{" "}
                      {job.salaryMax?.toLocaleString()}
                    </div>
                  )}
                </div>

                {job.description && (
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {job.description}
                  </p>
                )}

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.requiredSkills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 5 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{job.requiredSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {/* FIXED: Only button is clickable, not the entire card */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleJobClick(job._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSearchPage;
