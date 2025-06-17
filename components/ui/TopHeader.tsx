"use client";

import React from "react";
import { Menu, Bell, Sun } from "lucide-react";

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  return (
    <div className="flex items-center justify-between h-full px-4">
      <button onClick={onToggleSidebar} className="text-white">
        <Menu className="w-6 h-6 text-green-700" />
      </button>
      <div className="flex items-center gap-5 mr-[20px] ">
        <span>
          <a href="#">
            <Sun className=" w-6 h-6 text-green-600" />
          </a>
        </span>
        <span>
          <a href="#">
            <Bell className=" w-6 h-6 text-green-600" />
          </a>
        </span>
        <a href="#">
          <img src="/anh1.jpg" alt="avatar" className="w-9 h-9 rounded-full " />
        </a>
      </div>
    </div>
  );
};

export default TopHeader;
