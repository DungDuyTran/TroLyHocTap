"use client";

import React, { useState } from "react";

export default function ScheduleForm({
  onAdd,
}: {
  onAdd: (event: { title: string; start: string; end: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onAdd({ title, start, end });
    setTitle("");
    setStart("");
    setEnd("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        className="bg-gray-800 text-white p-2 rounded"
        placeholder="Tên môn học"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="bg-gray-800 text-white p-2 rounded"
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        className="bg-gray-800 text-white p-2 rounded"
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <button type="submit" className="bg-green-600 text-white py-2 rounded">
        Thêm lịch học
      </button>
    </form>
  );
}
