"use client";
// trang hiển thị lịch học lấy từ database (API).

import React, { useEffect, useState } from "react";
import ScheduleView from "../calender/schedulePage/ScheduleView";

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
}

export default function ScheduleList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lichHoc")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          console.error("API không trả về mảng:", data);
        }
      })
      .catch((err) => console.error("Lỗi khi fetch lịch học:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-white p-4">
        Đang tải lịch học từ cơ sở dữ liệu...
      </div>
    );
  }

  return <ScheduleView events={events} onEventClick={() => {}} />;
}
