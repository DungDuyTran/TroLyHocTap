"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Thêm kiểu props
type ScheduleViewProps = {
  events: {
    title: string;
    start: string;
    end: string;
  }[];
};

export default function ScheduleView({ events }: ScheduleViewProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">📅 Lịch học của bạn</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height="auto"
      />
    </div>
  );
}
