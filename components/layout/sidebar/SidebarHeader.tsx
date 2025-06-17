import React from "react";
import { BriefcaseBusiness, GraduationCap } from "lucide-react";

const SidebarHeader = () => {
  return (
    <div className="w-full flex justify-center items-center mt-[10px]">
      <a href="#" className="flex items-center">
        <GraduationCap className="w-7 h-7 mr-[10px] text-green-600 " />

        <span className="text-2xl ">STUDY</span>
      </a>
    </div>
  );
};

export default SidebarHeader;
