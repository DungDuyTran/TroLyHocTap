// app/login/page.tsx
"use client";

import React from "react";

// Không cần import MainLayout, CozeChatWidget, LandingPage, LearningLandingPage ở đây
// vì chúng đã được xử lý bởi app/login/layout.tsx hoặc app/page.tsx

export default function LoginPage() {
  return (
    <div>
      {/* Đây là nội dung của trang đăng nhập */}
      <h1>Trang Đăng Nhập</h1>
      <p>Form đăng nhập của bạn sẽ ở đây.</p>
      {/* Ví dụ: <LoginForm /> */}
      {/* Khi đăng nhập thành công, bạn sẽ điều hướng đến /login/trangWeb */}
    </div>
  );
}
