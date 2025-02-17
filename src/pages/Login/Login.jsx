import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";

// Add this near the top of the file, outside the component
const ADMIN_USER = {
  email: "admin",
  password: "pass",
  permissions: {
    productManagement: true,
    orderManagement: true,
    categoryManagement: true,
    couponsManagement: true,
    inventoryManagement: true,
    marketingManagement: true,
    userManagement: true
  }
};

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [forgotPassStep, setForgotPassStep] = useState(0);
  const [resetData, setResetData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetDataChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First try built-in admin credentials
      if (formData.username === "admin" && formData.password === "pass") {
        const adminPermissions = {
          productManagement: true,
          orderManagement: true,
          categoryManagement: true,
          couponsManagement: true,
          inventoryManagement: true,
          marketingManagement: true,
          userManagement: true
        };
        
        localStorage.setItem('userPermissions', JSON.stringify(adminPermissions));
        localStorage.setItem('userRole', 'admin');
        navigate("/dashboard");
        return;
      }

      // If not admin, try API login
      const response = await axios.post(`${API_BASE_URL}/api/admin/login`, {
        email: formData.username,
        password: formData.password
      });

      if (response.data.message === 'Login successful') {
        localStorage.setItem('userPermissions', JSON.stringify(response.data.user.permissions));
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userId', response.data.user._id);
        localStorage.setItem('token', response.data.user.token);
        navigate("/dashboard");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      setError(error.message || "Invalid email or password");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    switch (forgotPassStep) {
      case 1:
        console.log("Sending code to:", resetData.email);
        setForgotPassStep(2);
        break;

      case 2:
        console.log("Verifying code:", resetData.code);
        setForgotPassStep(3);
        break;

      case 3:
        if (resetData.newPassword !== resetData.confirmPassword) {
          alert("Passwords don't match!");
          return;
        }
        console.log("Updating password");
        setForgotPassStep(0);
        break;
    }
  };

  const renderForgotPasswordForm = () => {
    switch (forgotPassStep) {
      case 1:
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl mb-4">Reset Password</h2>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={resetData.email}
                    onChange={handleResetDataChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPassStep(0)}
                    className="px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                  >
                    Send Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl mb-4">Enter Verification Code</h2>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Enter the code sent to your email
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={resetData.code}
                    onChange={handleResetDataChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPassStep(0)}
                    className="px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                  >
                    Verify Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl mb-4">Set New Password</h2>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={resetData.newPassword}
                    onChange={handleResetDataChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={resetData.confirmPassword}
                    onChange={handleResetDataChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPassStep(0)}
                    className="px-4 py-2 text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const ErrorPopup = () => {
    if (!showError) return null;

    return (
      <div
        className="fixed top-4 right-4 bg-white border-l-4 border-red-500 p-4 rounded-md shadow-lg flex items-center space-x-4"
        role="alert"
      >
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1 text-sm font-medium text-gray-800">{error}</div>
        <button
          onClick={() => setShowError(false)}
          className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Add Error Popup */}
      <ErrorPopup />

      {/* Logo moved outside and above the card */}
      <div className="mb-8">
        <div className="w-16 h-16 flex">
          <img src="/logo.png" alt="logo" className="w-16 h-16" />
        </div>
      </div>

      <div className="max-w-md w-full p-6 bg-[#8860D028] rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Username or email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                placeholder="Username or email"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                placeholder="Password"
                required
              />
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setForgotPassStep(1)}
                className="text-purple-600 text-sm"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
          >
            Log In
          </button>
        </form>
      </div>

      {renderForgotPasswordForm()}
    </div>
  );
}

export default Login;
