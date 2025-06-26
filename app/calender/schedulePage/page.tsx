"use client";

import React, { useEffect, useState } from "react";
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

export default function SchedulePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEvents(parsed);
      } catch (err) {
        console.error("Lỗi khi parse localStorage:", err);
      }
    }
  }, []);

  const saveEvents = (updated: EventItem[]) => {
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

  const handleEventClick = (info: EventClickArg) => {
    const clickedEvent = events.find((e) => e.id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      setEditTitle(clickedEvent.title);
      setEditStart(clickedEvent.start);
      setEditEnd(clickedEvent.end);
      setShowPopup(true);
    }
  };

  const handleSave = () => {
    if (!selectedEvent) return;
    const updated = events.map((e) =>
      e.id === selectedEvent.id
        ? { ...e, title: editTitle, start: editStart, end: editEnd }
        : e
    );
    saveEvents(updated);
    setShowPopup(false);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    const updated = events.filter((e) => e.id !== selectedEvent.id);
    saveEvents(updated);
    setShowPopup(false);
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">📅 Lịch học của bạn</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
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

      {showPopup && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-[400px] space-y-3">
            <h3 className="text-lg font-bold mb-2">🛠️ Sửa lịch học</h3>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Tên môn học"
            />

            <input
              type="datetime-local"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <input
              type="datetime-local"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              className="w-full p-2 border rounded"
            />

            <div className="flex justify-between pt-4">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                ✅ Lưu
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                🗑️ Xóa
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
