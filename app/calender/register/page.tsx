"use client";

import React, { useEffect, useState } from "react";
import ScheduleForm from "../ScheduleForm";
import ScheduleView from "../SchedulePage";

export default function RegisterSchedulePage() {
  const [events, setEvents] = useState<
    { title: string; start: string; end: string }[]
  >([]);

  // Lấy dữ liệu từ localStorage khi vừa mở trang
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Hàm xử lý khi thêm lịch mới
  const handleAddEvent = (newEvent: {
    title: string;
    start: string;
    end: string;
  }) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents)); // Lưu vào localStorage
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black min-h-screen text-white">
      <ScheduleForm onAdd={handleAddEvent} />
      <ScheduleView events={events} />
    </div>
  );
}
