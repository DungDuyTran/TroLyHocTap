"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
}

interface Props {
  events: EventItem[];
  onEventClick: (info: EventClickArg) => void;
}

export default function ScheduleView({ events, onEventClick }: Props) {
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events.map((e) => ({ ...e, color: "#16a34a" }))} // bg-green-600
        eventClick={onEventClick}
        height="auto"
      />
      <style jsx global>{`
        /* Nền chung */
        .fc {
          background-color: #000 !important;
          color: white !important;
        }

        /* Tiêu đề, ngày tháng */
        .fc-toolbar-title,
        .fc-col-header-cell-cushion,
        .fc-daygrid-day-number,
        .fc-timegrid-slot-label,
        .fc-timegrid-axis,
        .fc-daygrid-day-top {
          color: white !important;
        }

        /* Header ngày (cái bạn đang bị trắng trắng) */
        .fc .fc-col-header-cell {
          background-color: #000 !important;
          border-color: #4b5563 !important; /* border-gray-600 */
        }

        /* Các sự kiện */
        .fc-event {
          background-color: #16a34a !important; /* bg-green-600 */
          color: white !important;
          border: none !important;
        }

        .fc-event-title {
          color: white !important;
        }

        /* Nút bấm */
        .fc-button {
          background-color: #1f2937 !important; /* bg-gray-800 */
          color: white !important;
          border: none !important;
        }

        .fc-button:hover {
          background-color: #374151 !important; /* bg-gray-700 */
        }
      `}</style>
    </div>
  );
}
