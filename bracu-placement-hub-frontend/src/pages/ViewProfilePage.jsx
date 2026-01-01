import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";  // ← ADD THIS


function ViewProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [targetId, setTargetId] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        // Extract ID from URL
        const pathParts = window.location.pathname.split("/");
        const id = pathParts[pathParts.length - 1];
        setTargetId(id);

        const [targetRes, currentRes] = await Promise.all([
          fetch(`/api/auth/profile-by-id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        if (!targetRes.ok) throw new Error("Failed to fetch target profile");
        
        const targetData = await targetRes.ok ? await targetRes.json() : null;
        const currentData = await currentRes.ok ? await currentRes.json() : null;

        setUser(targetData.user);
        setCurrentUser(currentData.user);
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const isOwnProfile = currentUser && user && currentUser._id === user._id;
  const isRecruiterViewingStudent = currentUser?.role === "recruiter" && user?.role === "student";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">No user data found.</p>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{isOwnProfile ? "Your Profile" : `${user.name}'s Profile`}</h1>
          <div className="flex gap-2">
            {!isOwnProfile && isRecruiterViewingStudent && (
              <>
                <button
                  onClick={() => navigate("/recruiter/search-talent")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition"
                >
                  📧 Invite to Job
                </button>
                <button
                  onClick={() => navigate(`/messages?userId=${user._id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition"
                >
                  💬 Message
                </button>
              </>
            )}
            {isOwnProfile && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition"
              >
                Logout
              </button>
            )}
            {!isOwnProfile && (
              <button
                 onClick={() => navigate(-1)}
                 className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-semibold transition"
              >
                Back
              </button>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600">User ID</p>
              <p className="text-lg font-semibold">{user.userId}</p>
            </div>
            <div>
              <p className="text-gray-600">Student ID</p>
              <p className="text-lg font-semibold">{user.studentId || user.userId || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Department</p>
              <p className="text-lg font-semibold">
                {user.department || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">CGPA</p>
              <p className="text-lg font-semibold">{user.cgpa || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests && user.interests.length > 0 ? (
              user.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-gray-600">No interests added yet.</p>
            )}
          </div>
        </div>

        {/* Work Experience Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
          {user.workExperience && user.workExperience.length > 0 ? (
            <div className="space-y-4">
              {user.workExperience.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-800">
                        {exp.position}
                      </p>
                      <p className="text-gray-700 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-purple-700 bg-purple-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                      {exp.duration}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 italic">
                No work experience added yet.
              </p>
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Education</h2>
          {user.education && user.education.length > 0 ? (
            <div className="space-y-4">
              {user.education.map((edu, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <p className="text-lg font-semibold text-gray-800">
                    {edu.degree}
                  </p>
                  <p className="text-gray-700 font-medium mt-1">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-green-700 bg-green-100 px-3 py-1 rounded-full inline-block mt-2">
                    {edu.year}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 italic">
                No education history added yet.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate("/profile/edit")}
              className="w-full md:w-1/2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold text-lg transition"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ViewProfilePage;
