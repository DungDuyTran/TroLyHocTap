"use client";

import React from "react";
import MainLayout from "./components/MainLayout";
import CozeChatWidget from "./components/AiCoze";
import LandingPage from "./components/GioiThieu";

export default function HomePage() {
  return (
    <div>
      {" "}
      <LandingPage />
      <CozeChatWidget />
    </div>
  );
}
