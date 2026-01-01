import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs"); // jobs, reviews
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    checkAuthAndFetchData();
  }, [activeTab]);

  const checkAuthAndFetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch user profile
      const profileResponse = await fetch("http://localhost:1350/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!profileResponse.ok) throw new Error("Failed to fetch profile");
      const profileData = await profileResponse.json();

      if (profileData.user.role !== "recruiter") {
        navigate("/");
        return;
      }

      const statusResponse = await fetch("http://localhost:1350/api/profile/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const statusData = await statusResponse.json();

      if (statusData.success && !statusData.hasProfile) {
        navigate("/company/create-profile");
        return;
      }

      setUserInfo(profileData.user);

      if (activeTab === "jobs") {
        await fetchJobs();
      } else {
        await fetchReviews();
      }
    } catch (err) {
      console.error("Auth/Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:1350/api/recruiter/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setJobs(data.jobs || []);
  };

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:1350/api/recruiter/reviews", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setReviews(data.reviews || []);
    setReviewStats(data.stats || null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleMarkAsFilled = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/recruiter/jobs/${jobId}/mark-filled`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to update status");
      alert("Job marked as filled!");
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:1350/api/recruiter/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete");
      alert("Job deleted successfully!");
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 italic text-gray-400">
        Loading recruiter dashboard...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Modern Header */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                  {userInfo?.companyName?.charAt(0) || "R"}
               </div>
               <div>
                  <h1 className="text-2xl font-black text-gray-900 leading-none">Recruiter Central</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{userInfo?.companyName || "Your Company"}</p>
               </div>
            </div>
            <div className="flex gap-4">
               <button onClick={() => navigate("/recruiter/jobs/create")} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">+ Post Job</button>
               <button onClick={handleLogout} className="px-4 py-2 border-2 border-red-50 text-red-600 rounded-lg font-bold hover:bg-red-50 transition">Logout</button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="max-w-7xl mx-auto px-6 flex border-t">
             <button 
                onClick={() => setActiveTab("jobs")}
                className={`py-4 px-8 font-black text-sm uppercase tracking-widest border-b-4 transition ${activeTab === "jobs" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
             >💼 Job Postings</button>
             <button 
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-8 font-black text-sm uppercase tracking-widest border-b-4 transition ${activeTab === "reviews" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
             >⭐ Company Reviews</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {error && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold rounded-r-lg">{error}</div>}

          {activeTab === "jobs" ? (
            <div className="space-y-8 animate-fadeIn">
               {/* Quick Stats */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <p className="text-gray-400 text-xs font-black uppercase mb-1">Total Postings</p>
                     <p className="text-4xl font-black text-gray-900">{jobs.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <p className="text-gray-400 text-xs font-black uppercase mb-1">Applications</p>
                     <p className="text-4xl font-black text-blue-600">{jobs.reduce((acc, j) => acc + (j.applications_count || 0), 0)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                     <p className="text-gray-400 text-xs font-black uppercase mb-1">Open Roles</p>
                     <p className="text-4xl font-black text-green-600">{jobs.filter(j => j.status === "Open").length}</p>
                  </div>
               </div>

               {/* Action Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button onClick={() => navigate("/recruiter/search-talent")} className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl text-left text-white shadow-xl hover:-translate-y-1 transition group relative overflow-hidden">
                     <span className="text-6xl absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition">🔍</span>
                     <h3 className="text-2xl font-black mb-2">AI Talent Search</h3>
                     <p className="text-blue-100 font-medium mb-6">Find the perfect students with Gemini AI matching.</p>
                     <span className="bg-white/20 px-4 py-2 rounded-lg font-bold backdrop-blur-md">Start Matching →</span>
                  </button>
                  <button onClick={() => navigate("/calendar")} className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl text-left text-white shadow-xl hover:-translate-y-1 transition group relative overflow-hidden">
                     <span className="text-6xl absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition">📅</span>
                     <h3 className="text-2xl font-black mb-2">Interview Calendar</h3>
                     <p className="text-purple-100 font-medium mb-6">Manage all upcoming slots and recruitment drives.</p>
                     <span className="bg-white/20 px-4 py-2 rounded-lg font-bold backdrop-blur-md">View Slots →</span>
                  </button>
               </div>

               {/* Jobs Table */}
               <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b flex justify-between items-center">
                     <h3 className="text-xl font-black text-gray-900">Your Postings</h3>
                  </div>
                  <div className="divide-y">
                     {jobs.length > 0 ? jobs.map(j => (
                        <div key={j._id} className="p-8 hover:bg-gray-50/50 transition flex justify-between items-center">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <h4 className="text-xl font-black text-gray-900">{j.title}</h4>
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${j.status === "Open" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>{j.status}</span>
                              </div>
                              <div className="flex gap-4 text-xs font-bold text-gray-400 italic">
                                 <span>📍 {j.location || "On-site"}</span>
                                 <span>💰 {j.salaryMin ? `${j.salaryMin} - ${j.salaryMax} BDT` : "Negotiable"}</span>
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <button onClick={() => navigate(`/recruiter/jobs/${j._id}/applications`)} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:shadow-lg transition">View Apps</button>
                              <button onClick={() => navigate(`/recruiter/jobs/edit/${j._id}`)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition group">Edit</button>
                              {j.status === "Open" && <button onClick={() => handleMarkAsFilled(j._id)} className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-sm hover:bg-green-600 hover:text-white transition">Filled</button>}
                              <button onClick={() => handleDeleteJob(j._id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition">🗑️</button>
                           </div>
                        </div>
                     )) : (
                        <div className="p-20 text-center opacity-40 italic font-bold">No active job postings found.</div>
                     )}
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-12 animate-fadeIn">
               {/* Rating Breakdown */}
               <section>
                  <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-4">
                     Rating Breakdown
                     <span className="text-sm bg-gray-200 text-gray-500 px-3 py-1 rounded-full font-bold">Based on {reviews.length} reviews</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {[
                        { label: "Overall", value: reviewStats?.overall || "0.0", color: "blue" },
                        { label: "Work Culture", value: reviewStats?.workCulture || "0.0", color: "purple" },
                        { label: "Salary", value: reviewStats?.salary || "0.0", color: "green" },
                        { label: "Career Growth", value: reviewStats?.careerGrowth || "0.0", color: "yellow" }
                     ].map(item => (
                        <div key={item.label} className={`p-8 bg-white border border-${item.color}-100 rounded-3xl text-center shadow-xl shadow-${item.color}-50/20 relative group hover:-translate-y-1 transition-transform`}>
                           <div className={`w-2 h-12 bg-${item.color}-500 absolute left-0 top-1/2 -translate-y-1/2 rounded-r-lg`}></div>
                           <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-2">{item.label}</p>
                           <p className={`text-5xl font-black text-${item.color}-600`}>{item.value}</p>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Recent Reviews */}
               <section>
                  <h3 className="text-3xl font-black text-gray-900 mb-8">Employee Feedback</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {reviews.length > 0 ? reviews.map(r => (
                        <div key={r._id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative group overflow-hidden">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <div className="flex text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => <span key={i} className={i < r.rating ? "text-xl" : "text-xl opacity-20"}>★</span>)}
                                 </div>
                                 <p className="font-black text-gray-900">{r.reviewer?.name || "Anonymous Employee"}</p>
                                 <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="bg-gray-50 px-4 py-2 rounded-2xl">
                                 <span className="text-2xl font-black text-blue-600">{r.rating}.0</span>
                              </div>
                           </div>

                           <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t font-black">
                              <div className="text-center">
                                 <p className="text-[10px] text-gray-400 uppercase mb-1">Culture</p>
                                 <p className="text-purple-600">{r.workCulture}.0</p>
                              </div>
                              <div className="text-center border-x">
                                 <p className="text-[10px] text-gray-400 uppercase mb-1">Salary</p>
                                 <p className="text-green-600">{r.salary}.0</p>
                              </div>
                              <div className="text-center">
                                 <p className="text-[10px] text-gray-400 uppercase mb-1">Growth</p>
                                 <p className="text-yellow-600">{r.careerGrowth}.0</p>
                              </div>
                           </div>

                           <div className="p-6 bg-blue-50 rounded-2xl italic text-gray-700 leading-relaxed font-medium">
                              "{r.comment}"
                           </div>

                           {r.aiAnalysis && (
                              <div className="mt-4 p-4 border border-blue-100 bg-white rounded-2xl flex items-center gap-3">
                                 <span className="text-xl">🤖</span>
                                 <p className="text-[10px] font-black text-blue-800 uppercase leading-none">{r.aiAnalysis}</p>
                              </div>
                           )}
                        </div>
                     )) : (
                        <div className="col-span-full py-20 text-center text-gray-400 font-bold italic">No company reviews found yet. Keep hiring and growing!</div>
                     )}
                  </div>
               </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RecruiterDashboard;
