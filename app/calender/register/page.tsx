"use client";

import React, { useEffect, useState } from "react";
import ScheduleForm from "../../components/ScheduleForm";

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
}

export default function RegisterPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  const handleAddEvent = (event: {
    title: string;
    start: string;
    end: string;
  }) => {
    const newEvent: EventItem = {
      id: crypto.randomUUID(),
      ...event,
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
    alert("📝 Thêm lịch thành công!");
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center ">
      <div className="w-full max-w-md p-1 bg-black rounded shadow-lg ">
        <h1 className="text-4xl font-bold mb-4 text-center mt-12">
          📝 Đăng ký lịch học
        </h1>
        <ScheduleForm onAdd={handleAddEvent} />
      </div>
    </div>
  );
}
