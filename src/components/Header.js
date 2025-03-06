import { Search, LogOut, UserCog, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("userRole");
    setUserRole(data);
    console.log(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userPermissions");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center bg-white text-black gap-4 px-4 py-2 rounded-full">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="search"
          placeholder="Search"
          className="border-none outline-none bg-white border-gray-200 rounded-md"
        />
      </div>
      <div className="relative">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-8 h-8 bg-gray-200 font-medium rounded-full"></div>
          <span className="capitalize">{ userRole }</span>
          <ChevronDown className="w-4 h-4" />
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
            {/* <div className="px-4 py-2 border-b border-gray-200"> */}
              {/* <p className="font-medium capitalize">{{ userRole }}</p> */}
              {/* <p className="text-sm text-gray-500">Last Login: 10:12AM</p> */}
            {/* </div> */}
            <div className="py-0">
              {/* <button
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={() => navigate("/profile")}
              >
                <UserCog className="w-4 h-4" />
                Edit Profile
              </button> */}
              <button
                className="w-full px-4 py-1 text-left hover:bg-gray-100 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
