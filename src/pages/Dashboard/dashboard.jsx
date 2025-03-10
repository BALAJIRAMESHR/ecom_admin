import React, { useState } from "react";
import Sidebar from "../../components/SideBar";
import Header from "../../components/Header";
import Dash from "./components/dash";

const Inventory = () => {
  const localStorage = window.localStorage;
  const token = localStorage.getItem("userPermissions");
  if (!token) {
    window.location.href = "/login";
  }
  const [activePage, setActivePage] = useState("Dash");

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F4F4]">
      <Sidebar active={activePage} onNavigate={handleNavigate} />
      <div className="flex-1 py-6 px-8 max-h-screen min-h-screen overflow-scroll">
        <Header />
        <Dash setInventory={Dash} />
      </div>
    </div>
  );
};

export default Inventory;
