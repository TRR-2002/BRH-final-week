import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobDetails } from "../api/jobApi";
import JobLocationMap from "../components/JobLocationMap";

function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const data = await getJobDetails(jobId);
      setJob(data.job);
      setHasApplied(data.hasApplied);
    } catch (err) {
      setError(err.error || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleBackToSearch = () => {
    navigate("/jobs");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBackToSearch}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Job Search
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-600">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBackToSearch}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Job Search
        </button>

        {/* Job Header Card */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {job.title}
              </h1>
              <p className="text-2xl text-gray-700 mb-2">{job.company}</p>
              {job.location && (
                <p className="text-gray-600 flex items-center">
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
                </p>
              )}
            </div>
            <div className="ml-4">
              <span
                className={`px-4 py-2 rounded-full font-semibold ${
                  job.status === "Open"
                    ? "bg-green-100 text-green-800"
                    : job.status === "Closed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {job.status}
              </span>
            </div>
          </div>

          {/* Job Meta Information */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-700 font-semibold">{job.type}</span>
            </div>
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
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
                <span className="text-gray-700 font-semibold">
                  ৳{job.salaryMin?.toLocaleString()} - ৳
                  {job.salaryMax?.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* EXTERNAL API INTEGRATION: Interactive Map Section */}
        {job.coordinates && job.coordinates.lat && job.coordinates.lng && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-600"
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
              Job Location
            </h2>
            <p className="text-gray-600 mb-4">
              View the exact location on an interactive map. Click the marker
              for more details.
            </p>
            {/* Map Component - Fetches tiles from OpenStreetMap API */}
            <JobLocationMap
              latitude={job.coordinates.lat}
              longitude={job.coordinates.lng}
              company={job.company}
              jobTitle={job.title}
            />
            <p className="text-sm text-gray-500 mt-3 text-center">
              💡 Powered by OpenStreetMap - Pan, zoom, and click the marker to
              explore
            </p>
          </div>
        )}

        {/* Job Description */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Job Description
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Application Status & Action Button */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {hasApplied ? (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-8 h-8 text-green-600 mr-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-xl font-bold text-green-800">
                    Application Submitted
                  </p>
                  <p className="text-green-700 mt-1">
                    You have already applied to this job. Check your dashboard
                    for application status.
                  </p>
                </div>
              </div>
            </div>
          ) : job.status === "Open" ? (
            <button
              onClick={handleApply}
              className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xl transition"
            >
              Apply Now
            </button>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <p className="text-xl font-semibold text-gray-700">
                This job is no longer accepting applications
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
