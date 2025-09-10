"use client";
// trang thêm lịch học mới.
import React, { useEffect, useState } from "react";
import ScheduleForm from "../../components/ScheduleForm";
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

export default function RegisterSchedulePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEvents(parsed);
      } catch (err) {
        console.error("Lỗi parse localStorage:", err);
      }
    }
  }, []);

  const saveEvents = (updated: EventItem[]) => {
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

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
    saveEvents(updated);
    alert("📝 Thêm lịch thành công!");
  };

  const handleEventClick = (info: EventClickArg) => {
    const clickedEvent = events.find((e) => e.id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent({ ...clickedEvent });
      setShowPopup(true);
    }
  };

  const handleSave = (
    editTitle: string,
    editStart: string,
    editEnd: string
  ) => {
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
    <div className="min-h-screen bg-black text-white px-2">
      <div className="max-w-5xl w-full mx-auto space-y-10 bg-black ">
        {/* Form thêm lịch */}
        <div className="flex items-center justify-center w-[750px] bg-black">
          <ScheduleForm onAdd={handleAddEvent} />
        </div>

        {/* Hiển thị lịch học */}

        {/* Popup chỉnh sửa */}
        {showPopup && selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white text-black p-6 rounded shadow-lg w-full max-w-md space-y-3">
              <h3 className="text-lg font-bold mb-2">🛠️ Sửa lịch học</h3>

              <div>
                <label className="block font-medium">Môn học</label>
                <input
                  type="text"
                  value={selectedEvent.title}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Bắt đầu</label>
                <input
                  type="datetime-local"
                  value={selectedEvent.start}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      start: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block font-medium">Kết thúc</label>
                <input
                  type="datetime-local"
                  value={selectedEvent.end}
                  onChange={(e) =>
                    setSelectedEvent({
                      ...selectedEvent,
                      end: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() =>
                    handleSave(
                      selectedEvent.title,
                      selectedEvent.start,
                      selectedEvent.end
                    )
                  }
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
    </div>
  );
}
