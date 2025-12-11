import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

function EditWorkExperiencePage() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        // Handle cases where user might not be logged in properly if needed
        return;
      }
      try {
        const response = await api.get("/auth/profile"); // Token is sent automatically
        setExperience(response.data.user.workExperience || []);
      } catch (error) {
        console.error("Failed to fetch profile for work experience", error);
        setError("Failed to load work experience.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleExperienceChange = (index, e) => {
    const updatedExperience = [...experience];
    updatedExperience[index][e.target.name] = e.target.value;
    setExperience(updatedExperience);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      { company: "", position: "", duration: "", description: "" },
    ]);
  };

  const removeExperience = (index) => {
    if (experience.length > 1) {
      // Prevent removing the last item
      const updatedExperience = [...experience];
      updatedExperience.splice(index, 1);
      setExperience(updatedExperience);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");

    try {
      const profileData = {
        workExperience: experience, // Sending only the work experience array
      };

      await api.put(`/profile/${user.userId}`, profileData);
      alert("Work Experience Updated!");
      navigate(`/profile/view/${user.userId}`); // Navigate back to the profile view
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Update failed. Please check console for errors.");
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading experience...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Link
          to="/profile/edit"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          &larr; Back to Edit Menu
        </Link>
        <h1 className="text-2xl font-bold mb-2">Edit Work Experience</h1>
        <p className="text-gray-500 mb-6">
          Update your job history and internships
        </p>

        <form onSubmit={handleSubmit}>
          {experience.map((exp, index) => (
            <div
              key={index}
              className="relative p-4 border border-gray-200 rounded-lg mb-4"
            >
              <h3 className="font-semibold text-gray-700 mb-2">
                Experience #{index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, e)}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role / Title
                  </label>
                  <input
                    name="position"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, e)}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  name="duration"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(index, e)}
                  type="text"
                  placeholder="e.g., Jan 2024 - Present"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, e)}
                  placeholder="Briefly describe your responsibilities..."
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                />
              </div>

              {experience.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
                >
                  &times;
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="w-full text-center py-2 mt-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700"
          >
            + Add New Experience
          </button>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditWorkExperiencePage;
