import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("stats"); // stats, flagged, users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stats data
  const [stats, setStats] = useState(null);

  // Flagged content
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [contentType, setContentType] = useState("all"); // all, reviews, posts, comments

  // Users
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  // Selected Detail View
  const [selectedUser, setSelectedUser] = useState(null); 
  const [jobApplicants, setJobApplicants] = useState(null);
  const [viewMode, setViewMode] = useState("main"); // main, user_detail, job_applicants

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (viewMode === "main") {
      if (activeTab === "stats") {
        fetchStats();
      } else if (activeTab === "flagged") {
        fetchFlaggedContent();
      } else if (activeTab === "users") {
        fetchUsers();
      }
    }
  }, [activeTab, contentType, viewMode]);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:1350/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.user.role !== "admin") {
        alert("Access denied. Admin only.");
        navigate("/");
        return;
      }

      setLoading(false);
    } catch (err) {
      console.error("Auth error:", err);
      navigate("/login");
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:1350/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch stats");
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchFlaggedContent = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        contentType === "all"
          ? "http://localhost:1350/api/admin/flagged-content"
          : `http://localhost:1350/api/admin/flagged-content?type=${contentType}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch flagged content");
      setFlaggedContent(data.flaggedContent);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = userSearch
        ? `http://localhost:1350/api/admin/users?search=${userSearch}`
        : "http://localhost:1350/api/admin/users";

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleContentAction = async (contentId, contentType, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this content?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/admin/content/${contentId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentType, action }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action failed");
      alert(data.message);
      fetchFlaggedContent();
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/admin/users/${userId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch details");
      setSelectedUser(data);
      setViewMode("user_detail");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobApplicants = async (jobId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/admin/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch applicants");
      setJobApplicants(data);
      setViewMode("job_applicants");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId, days = 30) => {
    const daysInput = prompt(`Suspend user for how many days?`, days);
    if (!daysInput) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/admin/users/${userId}/suspend`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ days: parseInt(daysInput) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to suspend user");
      alert(data.message);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY DELETE this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete user");
      alert(data.message);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/admin/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      alert(data.message);
      if (selectedUser?.user?._id) fetchUserDetails(selectedUser.user._id);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      alert(data.message);
      if (selectedUser?.user?._id) fetchUserDetails(selectedUser.user._id);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 italic text-gray-500">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🛡️ Admin Dashboard</h1>
              <p className="text-gray-600">Central command for platform moderation and management</p>
            </div>
            <button
              onClick={() => { localStorage.clear(); navigate("/login"); }}
              className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold shadow-lg"
            >
              Logout
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Conditional Views */}
          {viewMode === "user_detail" && selectedUser && (
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden animate-fadeIn pb-12">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold">
                    {selectedUser.user.role === "student" ? "👨‍🎓 Student Profile" : "💼 Recruiter Details"}
                  </h2>
                  <p className="opacity-80 mt-1">Viewing comprehensive {selectedUser.user.role} information</p>
                </div>
                <button 
                  onClick={() => setViewMode("main")}
                  className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg font-bold transition"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="p-8 max-w-5xl mx-auto">
                {selectedUser.user.role === "student" ? (
                  <div className="space-y-12">
                    {/* Basic Info */}
                    <section>
                      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-gray-500 text-sm">Name</p>
                          <p className="text-lg font-bold text-gray-800">{selectedUser.user.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Email</p>
                          <p className="text-lg font-bold text-gray-800">{selectedUser.user.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">User ID</p>
                          <p className="text-lg font-bold text-gray-800">{selectedUser.user.userId}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Student ID</p>
                          <p className="text-lg font-bold text-gray-800">{selectedUser.user.studentId || "N/A"}</p>
                        </div>
                      </div>
                    </section>

                    {/* Academic Info */}
                    <section>
                      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Academic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-gray-500 text-sm">Department</p>
                          <p className="text-lg font-bold text-gray-800">{selectedUser.user.department || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">CGPA</p>
                          <p className="text-lg font-bold text-gray-800">{selectedUser.user.cgpa || "N/A"}</p>
                        </div>
                      </div>
                    </section>

                    {/* Skills */}
                    <section>
                      <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.user.skills?.length > 0 ? (
                          selectedUser.user.skills.map(s => (
                            <span key={s} className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold border border-blue-200">{s}</span>
                          ))
                        ) : <p className="text-gray-400 italic">No skills listed</p>}
                      </div>
                    </section>

                    {/* Interests */}
                    <section>
                      <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.user.interests?.length > 0 ? (
                          selectedUser.user.interests.map(i => (
                            <span key={i} className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">{i}</span>
                          ))
                        ) : <p className="text-gray-400 italic">No interests listed</p>}
                      </div>
                    </section>

                    {/* Work Experience */}
                    <section>
                      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Work Experience</h3>
                      <div className="space-y-4">
                        {selectedUser.user.workExperience?.length > 0 ? (
                          selectedUser.user.workExperience.map((exp, idx) => (
                            <div key={idx} className="p-6 bg-purple-50/50 border-2 border-purple-100 rounded-xl relative">
                              <span className="absolute top-4 right-6 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">{exp.duration}</span>
                              <p className="text-lg font-bold text-gray-800">{exp.position}</p>
                              <p className="text-purple-700 font-bold mb-2">{exp.company}</p>
                              <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center bg-gray-50 border-2 border-dashed rounded-xl text-gray-400">No work experience added</div>
                        )}
                      </div>
                    </section>

                    {/* Education */}
                    <section>
                      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Education</h3>
                      <div className="space-y-4">
                        {selectedUser.user.education?.length > 0 ? (
                          selectedUser.user.education.map((edu, idx) => (
                            <div key={idx} className="p-6 bg-green-50/50 border-2 border-green-100 rounded-xl">
                              <div className="flex justify-between items-start mb-1">
                                <p className="text-lg font-bold text-gray-800">{edu.degree}</p>
                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">{edu.year}</span>
                              </div>
                              <p className="text-green-700 font-bold">{edu.institution}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-8 text-center bg-gray-50 border-2 border-dashed rounded-xl text-gray-400">No education history added</div>
                        )}
                      </div>
                    </section>

                    {/* Application History */}
                    <section>
                      <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Application History</h3>
                      <div className="overflow-hidden border rounded-xl shadow-sm">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-4 text-left font-bold text-gray-600">Job Title</th>
                              <th className="p-4 text-left font-bold text-gray-600">Company</th>
                              <th className="p-4 text-left font-bold text-gray-600">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedUser.applications?.length > 0 ? (
                              selectedUser.applications.map(app => (
                                <tr key={app._id} className="hover:bg-gray-50 transition">
                                  <td className="p-4 font-semibold">{app.job?.title}</td>
                                  <td className="p-4 text-gray-600">{app.job?.company}</td>
                                  <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                      app.status === "Accepted" ? "bg-green-100 text-green-800" :
                                      app.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                    }`}>{app.status}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="3" className="p-8 text-center text-gray-400">No applications yet</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Recruiter / Company Profile Section */}
                    <section className="bg-white border rounded-2xl shadow-sm p-8">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <h2 className="text-4xl font-black text-gray-900 leading-tight">{selectedUser.user.companyName || "Cool Company"}</h2>
                             <p className="text-blue-600 font-bold text-lg mb-2">{selectedUser.user.companyIndustry || "Technology"}</p>
                             <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                   {[...Array(5)].map((_, i) => (
                                      <span key={i} className={i < Math.round(selectedUser.stats?.overall || 0) ? "text-xl" : "text-xl opacity-20"}>★</span>
                                   ))}
                                </div>
                                <span className="font-black text-xl ml-2">{selectedUser.stats?.overall || "0.0"}</span>
                                <p className="text-gray-400 text-sm font-medium">({selectedUser.reviews?.length || 0} reviews)</p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Location</p>
                                <p className="font-bold text-gray-800">{selectedUser.user.companyLocation || "Dhaka"}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Company Size</p>
                                <p className="font-bold text-gray-800">{selectedUser.user.companySize || "1-50 Employees"}</p>
                             </div>
                          </div>
                       </div>
                       <div className="mt-8 border-t pt-6">
                          <h4 className="text-gray-400 uppercase font-black tracking-widest text-xs mb-3">About</h4>
                          <p className="text-gray-700 leading-relaxed text-lg">{selectedUser.user.companyDescription || "A leading company in its field."}</p>
                       </div>
                    </section>

                    {/* Rating Breakdown Cards */}
                    <section>
                       <h3 className="text-2xl font-black text-gray-900 mb-8">Rating Breakdown</h3>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {[
                            { label: "Overall", value: selectedUser.stats?.overall || "0.0", color: "blue" },
                            { label: "Work Culture", value: selectedUser.stats?.workCulture || "0.0", color: "purple" },
                            { label: "Salary", value: selectedUser.stats?.salary || "0.0", color: "green" },
                            { label: "Career Growth", value: selectedUser.stats?.careerGrowth || "0.0", color: "yellow" }
                          ].map(item => (
                             <div key={item.label} className={`p-6 bg-${item.color}-50 border border-${item.color}-100 rounded-2xl text-center shadow-sm`}>
                                <p className="text-gray-500 font-bold mb-2 text-sm">{item.label}</p>
                                <p className={`text-4xl font-black text-${item.color}-600`}>{item.value}</p>
                             </div>
                          ))}
                       </div>
                    </section>

                    {/* Detailed Content Management Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Job Postings */}
                      <section>
                        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                           📌 Active Job Postings
                           <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedUser.jobs?.length || 0}</span>
                        </h3>
                        <div className="space-y-4">
                          {selectedUser.jobs?.length > 0 ? (
                            selectedUser.jobs.map(j => (
                              <div key={j._id} className="bg-white p-6 border rounded-2xl hover:shadow-xl transition group">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{j.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">Status: <span className="font-bold text-green-600">{j.status}</span></p>
                                  </div>
                                  <div className="flex gap-2">
                                     <button onClick={() => fetchJobApplicants(j._id)} className="p-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-600 hover:text-white transition">Applicants</button>
                                     <button onClick={() => handleDeleteJob(j._id)} className="p-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs hover:bg-red-600 hover:text-white transition">Delete</button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : <p className="text-gray-400 italic">No jobs posted yet</p>}
                        </div>
                      </section>

                      {/* Reviews Management */}
                      <section>
                        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                           ⭐ Managed Reviews
                           <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{selectedUser.reviews?.length || 0}</span>
                        </h3>
                        <div className="space-y-6">
                           {selectedUser.reviews?.length > 0 ? (
                             selectedUser.reviews.map(r => (
                               <div key={r._id} className="bg-white p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
                                  <div className="flex justify-between items-start mb-4">
                                     <div>
                                        <div className="flex text-yellow-400 mb-1">
                                           {[...Array(5)].map((_, i) => (
                                              <span key={i} className={i < r.rating ? "text-sm" : "text-sm opacity-20"}>★</span>
                                           ))}
                                        </div>
                                        <p className="text-xs text-gray-400">by {r.reviewer?.name || "Anonymous"} • {new Date(r.createdAt).toLocaleDateString()}</p>
                                     </div>
                                     <button onClick={() => handleDeleteReview(r._id)} className="text-xs font-black text-red-600 hover:underline">DELETE REVIEW</button>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-50 p-3 rounded-xl">
                                     {["workCulture", "salary", "careerGrowth"].map(cat => (
                                        <div key={cat} className="text-center">
                                           <p className="text-[10px] text-gray-400 uppercase font-black">{cat.replace(/([A-Z])/g, ' $1')}</p>
                                           <div className="flex justify-center text-yellow-400 text-[10px]">
                                              {[...Array(5)].map((_, i) => (
                                                 <span key={i} className={i < r[cat] ? "" : "opacity-20"}>★</span>
                                              ))}
                                           </div>
                                        </div>
                                     ))}
                                  </div>

                                  <p className="text-gray-700 text-sm italic border-l-4 border-yellow-400 pl-4 py-1">"{r.comment}"</p>
                               </div>
                             ))
                           ) : <p className="text-gray-400 italic">No reviews received yet</p>}
                        </div>
                      </section>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === "job_applicants" && jobApplicants && (
            <div className="bg-white rounded-lg shadow-lg p-8 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Applicants for {jobApplicants.job.title}</h2>
                <button onClick={() => setViewMode("user_detail")} className="text-blue-600 font-bold">← Back to Recruiter</button>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                <div className="p-3 bg-blue-100 rounded">
                  <p className="text-xs opacity-70">Total</p>
                  <p className="text-xl font-bold">{jobApplicants.stats.total}</p>
                </div>
                <div className="p-3 bg-green-100 rounded">
                  <p className="text-xs opacity-70">Accepted</p>
                  <p className="text-xl font-bold">{jobApplicants.stats.accepted}</p>
                </div>
                <div className="p-3 bg-red-100 rounded">
                  <p className="text-xs opacity-70">Rejected</p>
                  <p className="text-xl font-bold">{jobApplicants.stats.rejected}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded">
                  <p className="text-xs opacity-70">Pending</p>
                  <p className="text-xl font-bold">{jobApplicants.stats.pending}</p>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Candidate</th>
                    <th className="p-3 text-left">Dept</th>
                    <th className="p-3 text-left">CGPA</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(jobApplicants.applications || []).map(app => (
                    <tr key={app._id}>
                      <td className="p-3">{app.user?.name}</td>
                      <td className="p-3">{app.user?.department}</td>
                      <td className="p-3 font-bold">{app.user?.cgpa}</td>
                      <td className="p-3">
                        <button onClick={() => fetchUserDetails(app.user?._id)} className="text-blue-600 font-bold hover:underline">Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {viewMode === "main" && (
            <>
              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`flex-1 py-4 px-6 font-bold transition-all ${activeTab === "stats" ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  >📊 Platform Stats</button>
                  <button
                    onClick={() => setActiveTab("flagged")}
                    className={`flex-1 py-4 px-6 font-bold transition-all ${activeTab === "flagged" ? "bg-red-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  >🚩 Flagged Content</button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`flex-1 py-4 px-6 font-bold transition-all ${activeTab === "users" ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                  >👥 User Management</button>
                </div>
              </div>

              {activeTab === "stats" && stats && (
                <div className="space-y-8 animate-fadeIn">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
                      <p className="text-gray-500 font-semibold mb-1">Total Users</p>
                      <p className="text-3xl font-bold">{stats.users.total}</p>
                      <p className="text-xs mt-2 text-gray-400">S:{stats.users.students} R:{stats.users.recruiters} A:{stats.users.admins}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500">
                      <p className="text-gray-500 font-semibold mb-1">Live Jobs</p>
                      <p className="text-3xl font-bold">{stats.jobs.open}</p>
                      <p className="text-xs mt-2 text-gray-400">Total: {stats.jobs.total}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-purple-500">
                      <p className="text-gray-500 font-semibold mb-1">Applications</p>
                      <p className="text-3xl font-bold">{stats.applications.total}</p>
                      <p className="text-xs mt-2 text-gray-400">Accepted: {stats.applications.accepted}</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-orange-500">
                       <p className="text-gray-500 font-semibold mb-1">Total Content</p>
                       <p className="text-3xl font-bold">{(stats?.content?.reviews || 0) + (stats?.content?.forumPosts || 0) + (stats?.content?.forumComments || 0)}</p>
                       <p className="text-xs mt-2 text-red-500 font-bold">Flagged: {(stats?.content?.flaggedReviews || 0) + (stats?.content?.flaggedPosts || 0) + (stats?.content?.flaggedComments || 0)}</p>
                     </div>
                   </div>

                  {/* Calendar Link */}
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Global Deadlines & Interviews</h3>
                        <p className="text-blue-100 opacity-80">Track all recruitment activity across the platform in real-time.</p>
                      </div>
                      <button onClick={() => navigate("/calendar")} className="bg-white text-blue-800 px-8 py-3 rounded-xl font-bold hover:shadow-2xl transition">View Full Calendar</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "flagged" && (
                <div className="space-y-4 animate-fadeIn">
                   {/* Filter */}
                   <div className="flex gap-2 mb-6">
                      {["all", "reviews", "posts", "comments"].map(t => (
                        <button key={t} onClick={() => setContentType(t)} className={`px-4 py-1 rounded-full text-sm font-bold capitalize ${contentType === t ? "bg-red-600 text-white" : "bg-white border"}`}>{t}</button>
                      ))}
                   </div>
                   {(flaggedContent || []).map(item => (
                     <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border-l-8 border-red-500">
                        <div className="flex justify-between mb-4">
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase">{item.type}</span>
                          <span className="text-xs text-gray-400">By {item.author?.name}</span>
                        </div>
                        <p className="text-gray-800 mb-4 font-medium italic">"{item.content || item.comment}"</p>
                        {item.aiAnalysis && (
                          <div className="p-3 bg-yellow-50 rounded-lg text-sm mb-4 border border-yellow-200">
                            <p className="font-bold text-yellow-800">🤖 AI Insight:</p>
                            <p>{item.aiAnalysis}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                           <button onClick={() => handleContentAction(item._id, item.type, "delete")} className="text-xs bg-red-600 text-white px-3 py-2 rounded font-bold">Delete</button>
                           <button onClick={() => handleContentAction(item._id, item.type, "warn")} className="text-xs bg-yellow-600 text-white px-3 py-2 rounded font-bold">Warn</button>
                           <button onClick={() => handleContentAction(item._id, item.type, "ignore")} className="text-xs bg-green-600 text-white px-3 py-2 rounded font-bold">Safe</button>
                        </div>
                     </div>
                   ))}
                   {(!flaggedContent || flaggedContent.length === 0) && <div className="text-center py-20 text-gray-400 font-bold">NO FLAGGED CONTENT CLEAN PLATFORM ✨</div>}
                </div>
              )}

              {activeTab === "users" && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-fadeIn">
                  <div className="p-4 border-b flex gap-2">
                    <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." className="flex-1 border p-2 rounded" />
                    <button onClick={fetchUsers} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">Search</button>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-4 text-left">User</th>
                        <th className="p-4 text-left">Role</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(users || []).map(u => (
                        <tr key={u._id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <p className="font-bold">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </td>
                          <td className="p-4 capitalize font-semibold">{u.role}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{u.isActive ? "Active" : "Suspended"}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                               <button onClick={() => fetchUserDetails(u._id)} className="text-blue-600 font-bold hover:underline">Details</button>
                               <button onClick={() => handleSuspendUser(u._id)} className="text-orange-600 font-bold hover:underline">Suspend</button>
                               <button onClick={() => handleDeleteUser(u._id)} className="text-red-600 font-bold hover:underline">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
