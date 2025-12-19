// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";

// function JobSearchPage() {
//   const navigate = useNavigate();
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filters, setFilters] = useState({
//     search: "",
//     location: "",
//     jobType: "",
//   });

//   // FIXED: Wrapped fetchJobs in useCallback
//   const fetchJobs = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(""); // Clear any previous errors

//       // FIXED: Ensure token is present
//       const token = localStorage.getItem("token");

//       if (!token) {
//         setError("Please login to view jobs");
//         setLoading(false);
//         setTimeout(() => navigate("/login"), 2000);
//         return;
//       }

//       const response = await fetch("http://localhost:1350/api/jobs", {
//         headers: {
//           Authorization: `Bearer ${token}`, // FIXED: Always include token
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error("Session expired. Please login again.");
//         }
//         throw new Error("Failed to fetch jobs");
//       }

//       const data = await response.json();
//       setJobs(data.jobs || []);
//     } catch (err) {
//       console.error("Error fetching jobs:", err);
//       setError(err.message || "Failed to load jobs");

//       if (err.message.includes("login")) {
//         setTimeout(() => navigate("/login"), 2000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]); // FIXED: Added navigate to dependencies

//   // FIXED: Added fetchJobs to dependency array
//   useEffect(() => {
//     fetchJobs();
//   }, [fetchJobs]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredJobs = jobs.filter((job) => {
//     const matchesSearch =
//       !filters.search ||
//       job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
//       job.company.toLowerCase().includes(filters.search.toLowerCase());

//     const matchesLocation =
//       !filters.location ||
//       job.location.toLowerCase().includes(filters.location.toLowerCase());

//     const matchesJobType = !filters.jobType || job.jobType === filters.jobType;

//     return matchesSearch && matchesLocation && matchesJobType;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <p className="text-xl text-gray-600">Loading jobs...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <p className="text-red-600 text-xl mb-4">{error}</p>
//           <button
//             onClick={() => navigate("/login")}
//             className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             Discover Your Next Opportunity
//           </h1>
//           <p className="text-gray-600">
//             Browse {jobs.length} available positions
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Search
//               </label>
//               <input
//                 type="text"
//                 name="search"
//                 value={filters.search}
//                 onChange={handleFilterChange}
//                 placeholder="Job title or company..."
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Location
//               </label>
//               <input
//                 type="text"
//                 name="location"
//                 value={filters.location}
//                 onChange={handleFilterChange}
//                 placeholder="City or region..."
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Job Type
//               </label>
//               <select
//                 name="jobType"
//                 value={filters.jobType}
//                 onChange={handleFilterChange}
//                 className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">All Types</option>
//                 <option value="Full-time">Full-time</option>
//                 <option value="Part-time">Part-time</option>
//                 <option value="Internship">Internship</option>
//                 <option value="Contract">Contract</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Job Listings */}
//         {filteredJobs.length === 0 ? (
//           <div className="bg-white p-12 rounded-lg shadow-md text-center">
//             <p className="text-xl text-gray-600 mb-4">No jobs found</p>
//             <p className="text-gray-500">
//               Try adjusting your filters or check back later for new
//               opportunities.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-6">
//             {filteredJobs.map((job) => (
//               <div
//                 key={job._id}
//                 className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
//                 onClick={() => navigate(`/jobs/${job._id}`)}
//               >
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                       {job.title}
//                     </h2>
//                     <p className="text-xl text-gray-600 mb-2">{job.company}</p>
//                     <div className="flex flex-wrap gap-3 text-sm text-gray-600">
//                       <span className="flex items-center gap-1">
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                         {job.location}
//                       </span>
//                       <span>•</span>
//                       <span>{job.jobType}</span>
//                       {job.salary && (
//                         <>
//                           <span>•</span>
//                           <span>{job.salary}</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                   <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
//                     Apply Now
//                   </span>
//                 </div>

//                 <p className="text-gray-700 line-clamp-2 mb-4">
//                   {job.description}
//                 </p>

//                 {job.requiredSkills && job.requiredSkills.length > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                     {job.requiredSkills.slice(0, 5).map((skill, index) => (
//                       <span
//                         key={index}
//                         className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
//                       >
//                         {skill}
//                       </span>
//                     ))}
//                     {job.requiredSkills.length > 5 && (
//                       <span className="px-3 py-1 text-gray-600 text-sm">
//                         +{job.requiredSkills.length - 5} more
//                       </span>
//                     )}
//                   </div>
//                 )}

//                 <div className="mt-4 text-sm text-gray-500">
//                   Posted {new Date(job.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default JobSearchPage;
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function JobSearchPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
  });

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setError("Please login to view jobs");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      console.log("Fetching jobs...");

      const response = await fetch("http://localhost:1350/api/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          setError("Session expired. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Jobs response:", data);

      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        console.log("Loaded jobs:", data.jobs.length);
      } else if (Array.isArray(data)) {
        setJobs(data);
        console.log("Loaded jobs:", data.length);
      } else {
        console.warn("Unexpected data format:", data);
        setJobs([]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !filters.search ||
      job.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesLocation =
      !filters.location ||
      job.location?.toLowerCase().includes(filters.location.toLowerCase());

    const matchesJobType = !filters.jobType || job.jobType === filters.jobType;

    return matchesSearch && matchesLocation && matchesJobType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-xl text-gray-600">Loading jobs...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-600 text-lg mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchJobs}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Job Discovery
          </h1>
          <p className="text-gray-600 text-lg">
            {jobs.length === 0
              ? "No jobs available at the moment"
              : `Browse ${jobs.length} available position${
                  jobs.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Job title or company..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City or region..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Job Type
              </label>
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
            <p className="text-xl text-gray-600 mb-4">No jobs found</p>
            <p className="text-gray-500">
              {jobs.length === 0
                ? "Check back later for new opportunities."
                : "Try adjusting your filters to see more results."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-blue-500 hover:border-blue-600"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
                      {job.title}
                    </h2>
                    <p className="text-xl text-gray-700 mb-3 font-semibold">
                      {job.company}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
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
                      </span>
                      <span>•</span>
                      <span className="font-medium">{job.jobType}</span>
                      {job.salary && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-semibold">
                            {job.salary}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold hover:bg-green-200 transition">
                    Apply Now →
                  </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.requiredSkills.slice(0, 6).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 6 && (
                      <span className="px-3 py-1 text-gray-600 text-sm font-medium">
                        +{job.requiredSkills.length - 6} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3 mt-3">
                  <span>
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 font-semibold hover:text-blue-800">
                    View Details →
                  </span>
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
