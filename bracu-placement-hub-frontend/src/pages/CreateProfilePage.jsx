import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";

function CreateProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    department: "",
    cgpa: "",
    skills: "",
    interests: "",
  });
  const [educationHistory, setEducationHistory] = useState([
    { institution: "", degree: "", year: "" },
  ]);
  const [experience, setExperience] = useState([
    { company: "", position: "", duration: "", description: "" },
  ]);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && user.name) {
      setFormData((prevState) => ({
        ...prevState,
        fullName: user.name,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const updated = [...educationHistory];
    updated[index][e.target.name] = e.target.value;
    setEducationHistory(updated);
  };
  const addSchool = () => {
    setEducationHistory([
      ...educationHistory,
      { institution: "", degree: "", year: "" },
    ]);
  };
  const removeSchool = (index) => {
    if (educationHistory.length > 1) {
      const list = [...educationHistory];
      list.splice(index, 1);
      setEducationHistory(list);
    }
  };

  const handleExperienceChange = (index, e) => {
    const updated = [...experience];
    updated[index][e.target.name] = e.target.value;
    setExperience(updated);
  };
  const addExperience = () => {
    setExperience([
      ...experience,
      { company: "", position: "", duration: "", description: "" },
    ]);
  };
  const removeExperience = (index) => {
    if (experience.length > 1) {
      const list = [...experience];
      list.splice(index, 1);
      setExperience(list);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return alert("You must be logged in to create a profile.");
    }

    const profileData = {
      studentId: formData.studentId,
      department: formData.department,
      cgpa: formData.cgpa,
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      interests: formData.interests
        .split(",")
        .map((i) => i.trim())
        .filter((i) => i),
      education: educationHistory,
      workExperience: experience,
    };

    try {
      await api.put(`/profile/${user.userId}`, profileData);
      alert("Profile created successfully! Redirecting...");
      navigate(`/profile/view/${user.userId}`);
    } catch (error) {
      console.error(
        "Failed to create profile:",
        error.response?.data || error.message
      );
      alert("Error creating profile. Please check the console.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800">
          Create Your Profile
        </h1>
        <p className="text-gray-500 mb-6">
          Complete your profile to get discovered by top recruiters
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID
                </label>
                <input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. 23101350"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. CSE"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CGPA
                </label>
                <input
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  type="text"
                  placeholder="e.g. 3.85"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Skills & Interests
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Python, Data Analysis"
                  className="w-full p-3 border border-gray-300 rounded-lg h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <textarea
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. Artificial Intelligence, FinTech"
                  className="w-full p-3 border border-gray-300 rounded-lg h-24"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Education History
                </h2>
                <p className="text-gray-500">Your academic journey</p>
              </div>
              <button
                type="button"
                onClick={addSchool}
                className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                + Add School
              </button>
            </div>
            {educationHistory.map((edu, index) => (
              <div
                key={index}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-4 pt-8 border border-gray-200 rounded-lg mb-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution Name
                  </label>
                  <input
                    name="institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, e)}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree/Certificate
                  </label>
                  <input
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Passing Year
                  </label>
                  <input
                    name="year"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, e)}
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                {educationHistory.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchool(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Experience
                </h2>
                <p className="text-gray-500">Internships, jobs, or projects</p>
              </div>
              <button
                type="button"
                onClick={addExperience}
                className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300"
              >
                + Add Experience
              </button>
            </div>
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative p-4 border border-gray-200 rounded-lg mb-4 space-y-4"
              >
                {experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    &times;
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, e)}
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
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
                      className="w-full p-3 border border-gray-300 rounded-lg"
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, e)}
                    placeholder="Briefly describe your responsibilities..."
                    className="w-full p-3 border border-gray-300 rounded-lg h-24"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProfilePage;
