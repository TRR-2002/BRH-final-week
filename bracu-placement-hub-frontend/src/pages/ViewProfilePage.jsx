// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// function ViewProfilePage() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // FIXED: Wrapped fetchProfile in useCallback
//   const fetchProfile = useCallback(async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:1350/api/profile/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to fetch profile");
//       }

//       const data = await response.json();
//       setProfile(data.profile);
//     } catch (err) {
//       console.error("Error fetching profile:", err);
//       setError("Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]); // FIXED: Added userId as dependency

//   // FIXED: Added fetchProfile to dependency array
//   useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <p className="text-xl text-gray-600">Loading profile...</p>
//       </div>
//     );
//   }

//   if (error || !profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <p className="text-red-600 text-xl mb-4">{error}</p>
//           <button
//             onClick={() => navigate("/")}
//             className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const loggedInUserId = localStorage.getItem("userId");
//   const isOwnProfile = loggedInUserId === userId;

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header Section */}
//         <div className="bg-white rounded-lg shadow-md p-8 mb-6">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-800 mb-2">
//                 {profile.name}
//               </h1>
//               <p className="text-xl text-gray-600">{profile.email}</p>
//             </div>
//             {isOwnProfile && (
//               <button
//                 onClick={() => navigate("/profile/edit")}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition"
//               >
//                 Edit Profile
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
//                 Department
//               </h3>
//               <p className="text-lg text-gray-800">{profile.department}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
//                 Student ID
//               </h3>
//               <p className="text-lg text-gray-800">{profile.studentId}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
//                 CGPA
//               </h3>
//               <p className="text-lg text-gray-800">{profile.cgpa || "N/A"}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
//                 Phone
//               </h3>
//               <p className="text-lg text-gray-800">{profile.phone || "N/A"}</p>
//             </div>
//           </div>
//         </div>

//         {/* Skills Section */}
//         {profile.skills && profile.skills.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-8 mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
//             <div className="flex flex-wrap gap-3">
//               {profile.skills.map((skill, index) => (
//                 <span
//                   key={index}
//                   className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Education Section */}
//         {profile.education && profile.education.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-8 mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
//             <div className="space-y-4">
//               {profile.education.map((edu, index) => (
//                 <div
//                   key={index}
//                   className="border-l-4 border-blue-500 pl-4 py-2"
//                 >
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     {edu.degree}
//                   </h3>
//                   <p className="text-gray-600">{edu.institution}</p>
//                   <p className="text-sm text-gray-500">
//                     {edu.startYear} - {edu.endYear || "Present"}
//                   </p>
//                   {edu.grade && (
//                     <p className="text-sm text-gray-600 mt-1">
//                       Grade: {edu.grade}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Experience Section */}
//         {profile.experience && profile.experience.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-8 mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               Experience
//             </h2>
//             <div className="space-y-4">
//               {profile.experience.map((exp, index) => (
//                 <div
//                   key={index}
//                   className="border-l-4 border-green-500 pl-4 py-2"
//                 >
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     {exp.position}
//                   </h3>
//                   <p className="text-gray-600">{exp.company}</p>
//                   <p className="text-sm text-gray-500">
//                     {exp.startDate} - {exp.endDate || "Present"}
//                   </p>
//                   {exp.description && (
//                     <p className="text-gray-700 mt-2">{exp.description}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Projects Section */}
//         {profile.projects && profile.projects.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-8 mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
//             <div className="space-y-4">
//               {profile.projects.map((project, index) => (
//                 <div
//                   key={index}
//                   className="border-l-4 border-purple-500 pl-4 py-2"
//                 >
//                   <h3 className="text-xl font-semibold text-gray-800">
//                     {project.title}
//                   </h3>
//                   <p className="text-gray-700 mt-2">{project.description}</p>
//                   {project.technologies && (
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {project.technologies.map((tech, techIndex) => (
//                         <span
//                           key={techIndex}
//                           className="px-2 py-1 bg-gray-200 text-gray-700 text-sm rounded"
//                         >
//                           {tech}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                   {project.link && (
//                     <a
//                       href={project.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
//                     >
//                       View Project →
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* REMOVED: Redundant buttons (Logout, Browse Jobs)
//             These are now in the Navbar, so we don't need them here */}
//       </div>
//     </div>
//   );
// }

// export default ViewProfilePage;
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ViewProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setError("Please login to view profiles");
        setLoading(false);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      console.log("Fetching profile for userId:", userId);

      const response = await fetch(
        `http://localhost:1350/api/profile/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          setError("Session expired. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        if (response.status === 404) {
          setError("Profile not found");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Profile data:", data);

      if (data.success && data.profile) {
        setProfile(data.profile);
        console.log("Profile loaded successfully");
      } else if (data.profile) {
        setProfile(data.profile);
        console.log("Profile loaded successfully");
      } else {
        console.error("No profile data in response");
        setError("Profile data not found");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Unable to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-xl text-gray-600">Loading profile...</p>
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
              onClick={fetchProfile}
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Profile not found</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const loggedInUserId = localStorage.getItem("userId");
  const isOwnProfile = loggedInUserId === userId;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {profile.name}
              </h1>
              <p className="text-xl text-gray-600">{profile.email}</p>
              {isOwnProfile && (
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                  Your Profile
                </span>
              )}
            </div>
            {isOwnProfile && (
              <button
                onClick={() => navigate("/profile/edit")}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition shadow-md hover:shadow-lg"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Department
              </h3>
              <p className="text-lg text-gray-800 font-medium">
                {profile.department || "Not specified"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Student ID
              </h3>
              <p className="text-lg text-gray-800 font-medium">
                {profile.studentId || "Not specified"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                CGPA
              </h3>
              <p className="text-lg text-gray-800 font-medium">
                {profile.cgpa || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Phone
              </h3>
              <p className="text-lg text-gray-800 font-medium">
                {profile.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💼</span> Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold hover:bg-blue-200 transition"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profile.education && profile.education.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎓</span> Education
            </h2>
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-md"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-600 font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {edu.startYear} - {edu.endYear || "Present"}
                  </p>
                  {edu.grade && (
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      Grade: {edu.grade}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>💼</span> Experience
            </h2>
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 pl-4 py-3 bg-gray-50 rounded-r-md"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {exp.position}
                  </h3>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {profile.projects && profile.projects.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🚀</span> Projects
            </h2>
            <div className="space-y-4">
              {profile.projects.map((project, index) => (
                <div
                  key={index}
                  className="border-l-4 border-purple-500 pl-4 py-3 bg-gray-50 rounded-r-md"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 mt-2">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block font-semibold"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State if no sections */}
        {(!profile.skills || profile.skills.length === 0) &&
          (!profile.education || profile.education.length === 0) &&
          (!profile.experience || profile.experience.length === 0) &&
          (!profile.projects || profile.projects.length === 0) && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">
                Profile is incomplete
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => navigate("/profile/edit")}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
                >
                  Complete Your Profile
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export default ViewProfilePage;
