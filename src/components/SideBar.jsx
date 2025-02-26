import React from "react";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active }) => {
  const navigate = useNavigate();
  const userPermissions = JSON.parse(
    localStorage.getItem("userPermissions") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("userPermissions");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const mainMenuItems = [
    { name: "Dashboard", icon: <Home className="w-5" />, permission: null }, // Always show Dashboard
    {
      name: "ProductManagement",
      icon: <Package className="w-5" />,
      permission: "productManagement",
    },
    { name: "Designlab", icon: <Package className="w-5" />, permission: "designlab" },
    {
      name: "CategoryManagement",
      icon: <BarChart2 className="w-5" />,
      permission: "categoryManagement",
    },
    {
      name: "Order",
      icon: <ShoppingCart className="w-5" />,
      permission: "orderManagement",
    },
    {
      name: "User Management",
      icon: <Users className="w-5" />,
      permission: "userManagement",
    },
    {
      name: "Coupons",
      icon: <BarChart2 className="w-5" />,
      permission: "couponsManagement",
    },
    {
      name: "Inventory",
      icon: <Settings className="w-5" />,
      permission: "inventoryManagement",
    },
    {
      name: "Marketing",
      icon: <BarChart2 className="w-5" />,
      permission: "marketingManagement",
    },
    {
      name: "Logout",
      icon: <LogOut className="w-5" />,
      permission: null,
      onClick: handleLogout,
    },
  ];

  const filteredMenuItems = mainMenuItems.filter(
    (item) => item.permission === null || userPermissions[item.permission]
  );

  const onNavigate = (page) => {
    navigate(`/${page.toLowerCase().replace(/\s+/g, "-")}`);
  };

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4 flex items-center justify-center">
        <img src="/assets/header.svg" alt="Logo" className="w-24 h-24" />
      </div>
      <nav className="mt-4 ml-4">
        {filteredMenuItems.map((item, index) => (
          <div
            key={index}
            className={`px-4 py-3 text-gray-700 flex items-center gap-3 hover:bg-purple-50 hover:text-purple-600 cursor-pointer ${
              active === item.name
                ? "bg-purple-100 text-purple-600 border-l-4 border-purple-700"
                : "border-l-4 border-white"
            }`}
            onClick={() =>
              item.onClick ? item.onClick() : onNavigate(item.name)
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
