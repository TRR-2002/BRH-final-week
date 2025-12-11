import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig"; // Use our central api instance
import { AuthContext } from "../context/AuthContext"; // To check if a user is logged in

function ViewProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //   const { userId } = useParams();
  const { user } = useContext(AuthContext); // Get logged-in user info from global state

  useEffect(() => {
    const fetchProfile = async () => {
      // Check if the user is logged in. The token is handled by our api instance.
      if (!user) {
        setLoading(false);
        setError("Please log in to view a profile.");
        return;
      }

      setLoading(true);
      try {
        // The API call is now clean. The base URL and Auth token are handled automatically.
        const response = await api.get("/auth/profile");

        setProfile(response.data.user);
      } catch (err) {
        setError("Failed to fetch profile data. Please try again later.");
        console.error("Fetch Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // This effect will re-run if the user logs in or out

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!profile) {
    return <div className="p-8 text-center">No profile data found.</div>;
  }

  // --- This is the JSX that displays the profile ---
  // --- This is the NEW JSX that displays the profile conditionally ---
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-blue-600 text-white rounded-t-lg p-8 relative">
          <div className="flex items-center space-x-6">
            <div className="bg-white p-1 rounded-full">
              <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-4xl font-bold">
                {profile.name.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-blue-200">{profile.department}</p>
              <div className="flex space-x-4 mt-1 text-sm">
                {/* FIX 1: Only show ID if studentId exists */}
                {profile.studentId && <span>ID: {profile.studentId}</span>}
                {profile.cgpa && <span>CGPA: {profile.cgpa}</span>}
              </div>
            </div>
          </div>
          {user && user.userId === profile.userId && (
            <Link
              to="/profile/edit"
              className="absolute top-6 right-6 bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-8">
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-8">
            {/* FIX 2: Conditionally render the entire Experience section */}
            {profile.workExperience && profile.workExperience.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4">Experience</h3>
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  {profile.workExperience.map((exp, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute -left-5 top-1 h-3 w-3 bg-gray-300 rounded-full"></div>
                      <p className="font-semibold">{exp.position}</p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* FIX 3: Conditionally render the entire Education section */}
            {profile.education && profile.education.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-4">Education</h3>
                <div className="space-y-4 border-l-2 border-gray-200 pl-4">
                  {profile.education.map((edu, i) => (
                    <div key={i} className="relative pl-4">
                      <div className="absolute -left-5 top-1 h-3 w-3 bg-gray-300 rounded-full"></div>
                      <p className="font-semibold">{edu.institution}</p>
                      <p className="text-sm text-gray-600">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProfilePage;
