"use client";

import React from "react";
import { Menu, Bell, Sun } from "lucide-react";
import AvatarDropdownMenu from "../topHeader/AvatarDropdownMenu";

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
            <h2 className="text-white hover:text-green-600">Blog</h2>
          </a>
        </span>
        <span>
          <a href="#">
            <h2 className="text-white  hover:text-green-600">Flashcards</h2>
          </a>
        </span>
        <span>
          <a href="#">
            <h2 className="text-white  hover:text-green-600">Đề thi online</h2>
          </a>
        </span>
        <span>
          <a href="#">
            <h2 className="text-white  hover:text-green-600">
              Khóa học của tôi
            </h2>
          </a>
        </span>

        <AvatarDropdownMenu />
      </div>
    </div>
  );
};

export default TopHeader;
