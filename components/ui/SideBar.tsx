import React from "react";
import { menuItems } from "../layout/sidebar/menu.items.config";
import SidebarMenuAccordionItem from "../layout/sidebar/SidebarMenuAccordionItem";
import SidebarMenu from "../layout/sidebar/SidebarMenu";
// import SidebarFooter from "../layout/sidebar/SidebarFooter";
import SidebarHeader from "../layout/sidebar/SidebarHeader";
const Sidebar = () => {
  return (
    <div className="h-full w-[270px] bg-gray-800 text-white flex flex-col">
      <SidebarHeader />
      {/* Vùng cuộn được: chứa menu items */}
      <div className="flex-1 overflow-y-auto space-y-2 p-4 custom-scrollbar">
        {menuItems.map((item) =>
          item.children ? (
            <SidebarMenuAccordionItem
              icon={item.icon}
              title={item.title}
              key={item.title}
              children={item.children}
            />
          ) : (
            <SidebarMenuItem
              icon={item.icon}
              title={item.title}
              key={item.title}
              href={item.href}
            />
          )
        )}
      </div>
      {/* <SidebarFooter /> */}
    </div>
  );
};

export default Sidebar;
