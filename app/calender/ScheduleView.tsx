"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

interface EventItem {
  title: string;
  start: string;
  end: string;
}

interface ScheduleViewProps {
  events?: EventItem[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ events = [] }) => {
  const defaultEvents: EventItem[] = [
    {
      title: "Lập trình Web",
      start: "2025-06-18T08:00:00",
      end: "2025-06-18T10:00:00",
    },
    {
      title: "Cấu trúc dữ liệu",
      start: "2025-06-19T13:30:00",
      end: "2025-06-19T15:00:00",
    },
  ];

  const allEvents = [...defaultEvents, ...events];

  return (
    <div className="p-4 bg-black border rounded shadow text-white">
      <h2 className="text-xl font-semibold mb-2">📅 Lịch học của bạn</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={allEvents}
        height="auto"
      />
      <style jsx global>{`
        .fc {
          background-color: #000 !important;
          color: white !important;
        }

        .fc-col-header-cell {
          background-color: #111 !important;
          color: white !important;
        }

        .fc-col-header-cell-cushion {
          color: white !important;
        }

        .fc-timegrid-slot,
        .fc-timegrid-slot-label {
          background-color: #000 !important;
          color: white !important;
        }

        .fc-toolbar-title {
          color: white !important;
        }

        .fc-button {
          background-color: #1f2937 !important;
          color: white !important;
          border: none;
        }

        .fc-button:hover {
          background-color: #374151 !important;
        }

        .fc-button-primary:disabled {
          background-color: #4b5563 !important;
          color: #d1d5db !important;
        }

        .fc-scrollgrid,
        .fc-scrollgrid-section {
          border-color: #333 !important;
        }

        .fc-event {
          background-color: #3b82f6 !important;
          border: none !important;
        }

        .fc-event-title {
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default ScheduleView;
