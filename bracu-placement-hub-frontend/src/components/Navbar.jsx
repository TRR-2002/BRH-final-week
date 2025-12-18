import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // FIXED: Initialize user state from localStorage directly
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (token && userId) {
      return {
        userId: userId,
        name: userName || "User",
        role: userRole || "student",
      };
    }
    return null;
  });

  // No useEffect needed for initial load since we use lazy initialization above
  // useEffect only needed if you want to listen for storage changes
  useEffect(() => {
    // Optional: Listen for storage changes from other tabs
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");
      const userRole = localStorage.getItem("userRole");

      if (token && userId) {
        setUser({
          userId: userId,
          name: userName || "User",
          role: userRole || "student",
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    // Clear all localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");

    // Clear user state
    setUser(null);

    // Redirect to login
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <span className="font-bold text-xl">BRACU Placement Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Common Links for All Users */}
                <Link
                  to={`/profile/view/${user.userId}`}
                  className="hover:text-blue-200 transition font-medium"
                >
                  My Profile
                </Link>

                <Link
                  to={`/dashboard/${user.userId}`}
                  className="hover:text-blue-200 transition font-medium"
                >
                  Dashboard
                </Link>

                {/* Student Links */}
                {user.role === "student" && (
                  <>
                    <Link
                      to="/jobs"
                      className="hover:text-blue-200 transition font-medium"
                    >
                      Browse Jobs
                    </Link>

                    <Link
                      to="/forum"
                      className="hover:text-blue-200 transition font-medium"
                    >
                      Community Forum
                    </Link>
                  </>
                )}

                {/* Recruiter Links */}
                {user.role === "recruiter" && (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className="hover:text-blue-200 transition font-medium"
                    >
                      Recruiter Dashboard
                    </Link>

                    <Link
                      to="/recruiter/jobs/create"
                      className="hover:text-blue-200 transition font-medium"
                    >
                      Post Job
                    </Link>
                  </>
                )}

                {/* Admin Links */}
                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="hover:text-blue-200 transition font-medium"
                  >
                    Admin Panel
                  </Link>
                )}

                {/* User Menu */}
                <div className="flex items-center space-x-4 border-l border-blue-400 pl-4">
                  <span className="text-sm font-medium">
                    Hello, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Not Logged In */}
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md font-semibold transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-700 transition"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link
                  to={`/profile/view/${user.userId}`}
                  className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>

                <Link
                  to={`/dashboard/${user.userId}`}
                  className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {user.role === "student" && (
                  <>
                    <Link
                      to="/jobs"
                      className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Browse Jobs
                    </Link>

                    <Link
                      to="/forum"
                      className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Community Forum
                    </Link>
                  </>
                )}

                {user.role === "recruiter" && (
                  <>
                    <Link
                      to="/recruiter/dashboard"
                      className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Recruiter Dashboard
                    </Link>

                    <Link
                      to="/recruiter/jobs/create"
                      className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Post Job
                    </Link>
                  </>
                )}

                {user.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <div className="border-t border-blue-400 pt-2 mt-2">
                  <div className="px-4 py-2 text-sm">
                    Logged in as: {user.name}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 hover:bg-blue-700 rounded-md transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-md font-semibold transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
