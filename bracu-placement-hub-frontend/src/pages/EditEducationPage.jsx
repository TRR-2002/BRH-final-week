import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

function EditEducationPage() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return setLoading(false);
      try {
        const response = await api.get("/auth/profile");
        setEducation(
          response.data.user.education || [
            { institution: "", degree: "", year: "" },
          ]
        );
      } catch (err) {
        console.error("Failed to fetch education", err);
        setError("Failed to load education history.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleEducationChange = (index, e) => {
    const updatedEducation = [...education];
    updatedEducation[index][e.target.name] = e.target.value;
    setEducation(updatedEducation);
  };

  const addEducation = () => {
    setEducation([...education, { institution: "", degree: "", year: "" }]);
  };

  const removeEducation = (index) => {
    if (education.length > 1) {
      const updatedEducation = [...education];
      updatedEducation.splice(index, 1);
      setEducation(updatedEducation);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");
    try {
      await api.put(`/profile/${user.userId}`, { education: education });
      alert("Education History Updated!");
      navigate(`/profile/view/${user.userId}`);
    } catch (err) {
      console.error("Failed to update education", err);
      alert("Update failed.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
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
        <h1 className="text-2xl font-bold mb-2">Edit Education</h1>
        <p className="text-gray-500 mb-6">Update your academic credentials</p>

        <form onSubmit={handleSubmit}>
          {education.map((edu, index) => (
            <div
              key={index}
              className="relative p-4 border rounded-lg mb-4 space-y-4"
            >
              <h3 className="font-semibold text-gray-700">
                Education #{index + 1}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="text"
                  name="year"
                  value={edu.year}
                  onChange={(e) => handleEducationChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="absolute top-2 right-2 text-red-500 font-bold text-xl"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEducation}
            className="w-full text-center py-2 mt-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold"
          >
            + Add New Education
          </button>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 mt-6 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditEducationPage;
