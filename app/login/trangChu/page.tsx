// app/page.tsx
"use client";

import React, { useState } from "react";
import { BookOpen, UserPlus, LogIn } from "lucide-react";

export default function LearningLandingPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Đăng nhập với:", { email, password });
    console.log("Login functionality is under development!");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Password and confirm password do not match!");
      return;
    }
    console.log("Đăng ký với:", { username, email, password });
    console.log("Register functionality is under development!");
  };

  const imageUrl = "/anh2.jpg";

  return (
    <div
      className="min-h-screen text-white font-inter flex flex-col lg:flex-row bg-cover bg-center"
      style={{ backgroundImage: `url('${imageUrl}')` }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative z-10 lg:w-1/2 p-8 flex flex-col justify-center items-center text-center bg-[rgba(0,0,0,0.4)] rounded-lg shadow-xl m-4 lg:m-8 backdrop-filter backdrop-blur-md">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-green-400 leading-tight drop-shadow-2xl">
          Nâng Tầm Học Tập Cùng AI
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl drop-shadow-lg">
          Giải phóng tiềm năng học tập của bạn với ứng dụng trợ lý thông minh,
          tích hợp trí tuệ nhân tạo để tối ưu hóa mọi phiên học và đạt được
          thành công vượt trội.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowLogin(false)}
            className="px-8 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
          >
            <UserPlus size={24} />
            <span>Đăng Ký Ngay</span>
          </button>
          <a
            href="/login/trangWeb"
            className="px-8 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
          >
            <LogIn size={24} />
            <span>Đăng Nhập</span>
          </a>
        </div>
      </div>

      <div className="relative z-10 lg:w-1/2 p-8 flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-8 flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)] rounded-xl shadow-xl m-4 lg:m-8 backdrop-blur-md backdrop-saturate-150">
          <h2 className="text-3xl font-bold mb-6 text-center text--300">
            {showLogin ? "Đăng Nhập" : "Đăng Ký"}
          </h2>
          {showLogin ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  className="shadow appearance-none border border-gray-600 rounded-md w-full py-3 px-4 text-white bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-gray-300 text-sm font-bold mb-2 w-[400px]"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="login-password"
                  className="shadow appearance-none border border-gray-600 rounded-md w-full py-3 px-4 text-white bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 rounded-md shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center justify-center space-x-2"
              >
                <LogIn size={26} />
                <span className="">Đăng Nhập</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label
                  htmlFor="register-username"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Tên người dùng
                </label>
                <input
                  type="text"
                  id="register-username"
                  className="shadow appearance-none border border-gray-600 rounded-md w-full py-3 px-4 text-white bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tên của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="register-email"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="register-email"
                  className="shadow appearance-none border border-gray-600 rounded-md w-full py-3 px-4 text-white bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="register-password"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="register-password"
                  className="shadow appearance-none border border-gray-600 rounded-md w-full py-3 px-4 text-white bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-gray-300 text-sm font-bold mb-2"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="shadow appearance-none border border-gray-600 rounded-md w-full py-3 px-4 text-white bg-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 rounded-md shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center justify-center space-x-2"
              >
                <UserPlus size={24} />
                <span>Đăng Ký</span>
              </button>
            </form>
          )}
          <p className="mt-6 text-center text-gray-400">
            {showLogin ? (
              <>
                Chưa có tài khoản?{" "}
                <button
                  onClick={() => setShowLogin(false)}
                  className="text-blue-400 hover:underline focus:outline-none"
                >
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{" "}
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-blue-400 hover:underline focus:outline-none"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
