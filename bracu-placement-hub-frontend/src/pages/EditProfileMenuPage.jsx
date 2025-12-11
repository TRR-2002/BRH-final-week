import React from "react";
import { Link } from "react-router-dom";

// A simple icon component for UI
const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const WorkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const EduIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M12 14.75L2 10l10-5.5 10 5.5-10 4.75z"
    />
  </svg>
);

function EditProfileMenuPage() {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/profile/view/tushit.roy"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          &larr; Back to Profile
        </Link>
        <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
        <p className="text-gray-600 mb-8">
          Choose which section you want to update
        </p>

        <div className="space-y-4">
          <Link
            to="/profile/edit/general"
            className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <InfoIcon />
              </div>
              <div>
                <h2 className="font-bold text-lg">General Information</h2>
                <p className="text-gray-500 text-sm">
                  Edit personal details, skills, interests, and academic info
                </p>
              </div>
            </div>
            <span className="text-gray-400">&rarr;</span>
          </Link>

          <Link
            to="/profile/edit/work"
            className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                <WorkIcon />
              </div>
              <div>
                <h2 className="font-bold text-lg">Work Experience</h2>
                <p className="text-gray-500 text-sm">
                  Update your job history and internships
                </p>
              </div>
            </div>
            <span className="text-gray-400">&rarr;</span>
          </Link>

          <Link
            to="/profile/edit/education"
            className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm hover:shadow-lg hover:bg-gray-50 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <EduIcon />
              </div>
              <div>
                <h2 className="font-bold text-lg">Education</h2>
                <p className="text-gray-500 text-sm">
                  Manage your degrees and certifications
                </p>
              </div>
            </div>
            <span className="text-gray-400">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EditProfileMenuPage;
