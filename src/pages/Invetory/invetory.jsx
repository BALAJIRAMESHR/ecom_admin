import React, { useState } from "react";
import Sidebar from "../../components/SideBar";
import Header from "../../components/Header";
import Invetory from "./components/invetorys"

const Inventory = () => {
  const [activePage, setActivePage] = useState("Inventory");

  const handleNavigate = (page) => {
    setActivePage(page);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F4F4]">
      <Sidebar active={activePage} onNavigate={handleNavigate} />
      <div className="flex-1 py-6 px-8 max-h-screen min-h-screen overflow-scroll">
        <Header />
                 <Invetory setInventory={Inventory} />
      </div>
    </div>
  );
};

export default Inventory;
