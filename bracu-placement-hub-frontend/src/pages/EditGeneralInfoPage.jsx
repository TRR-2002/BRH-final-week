import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

function EditGeneralInfoPage() {
  const [formData, setFormData] = useState({
    studentId: "",
    department: "",
    cgpa: "",
    skills: [],
    interests: [],
  });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const response = await api.get("/auth/profile");
        const profile = response.data.user;
        setFormData({
          studentId: profile.studentId || "",
          department: profile.department || "",
          cgpa: profile.cgpa || "",
          skills: profile.skills || [],
          interests: profile.interests || [],
        });
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");

    try {
      const profileData = {
        ...formData,
        skills: Array.isArray(formData.skills)
          ? formData.skills
          : formData.skills.split(",").map((s) => s.trim()),
        interests: Array.isArray(formData.interests)
          ? formData.interests
          : formData.interests.split(",").map((i) => i.trim()),
      };

      await api.put(`/profile/${user.userId}`, profileData);
      alert("General Info Updated!");
      navigate(`/profile/view/${user.userId}`);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Update failed.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <Link
          to="/profile/edit"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          &larr; Back to Edit Menu
        </Link>
        <h1 className="text-2xl font-bold mb-2">Edit General Info</h1>
        <p className="text-gray-500 mb-6">
          Update personal details, academic info, skills & interests
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Academic & Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  CGPA
                </label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Skills & Interests</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills (comma separated)
              </label>
              <textarea
                name="skills"
                value={
                  Array.isArray(formData.skills)
                    ? formData.skills.join(", ")
                    : formData.skills
                }
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interests (comma separated)
              </label>
              <textarea
                name="interests"
                value={
                  Array.isArray(formData.interests)
                    ? formData.interests.join(", ")
                    : formData.interests
                }
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-24"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditGeneralInfoPage;
