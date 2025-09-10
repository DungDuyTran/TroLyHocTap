"use client";

import React, { useState, useRef, useEffect } from "react";

export default function AvatarDropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLAnchorElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left z-50">
      <div>
        <a
          href="#"
          ref={avatarRef}
          onClick={toggleDropdown}
          className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <img
            src="/anh1.webp"
            alt="avatar"
            className="w-9 h-9 rounded-full cursor-pointer transition-transform duration-200 hover:scale-105"
          />
        </a>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none" // Đã thay đổi w-56 thành w-48 để nhỏ hơn
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <a
              href="/trang-ca-nhan"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              role="menuitem"
            >
              Trang cá nhân
            </a>
            <a
              href="/caiDat"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              role="menuitem"
            >
              Cài đặt
            </a>
            <a
              href="/caiDat"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
              role="menuitem"
            >
              Trợ giúp hỗ trợ
            </a>
            <a
              href="/"
              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-300"
              role="menuitem"
            >
              Đăng xuất
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
