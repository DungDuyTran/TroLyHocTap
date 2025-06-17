"use client";

import React, { useEffect, useState } from "react";
import ScheduleView from "./ScheduleView";
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

  // Input values for editing
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
      <ScheduleView events={events} onEventClick={handleEventClick} />

      {showPopup && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 rounded shadow-lg w-[400px] space-y-3">
            <h3 className="text-lg font-bold mb-2">🛠️ Sửa lịch học</h3>

            <div>
              <label className="block font-medium">Môn học</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Bắt đầu</label>
              <input
                type="datetime-local"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-medium">Kết thúc</label>
              <input
                type="datetime-local"
                value={editEnd}
                onChange={(e) => setEditEnd(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

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
                className="px-4 py-2 bg-gray-400 text-white rounded"
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
