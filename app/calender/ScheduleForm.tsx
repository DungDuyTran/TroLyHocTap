"use client";

import React, { useState } from "react";

type Props = {
  onAdd: (event: { title: string; start: string; end: string }) => void;
};

export default function ScheduleForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    onAdd({ title, start, end });

    setTitle("");
    setStart("");
    setEnd("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded shadow bg-black text-white"
    >
      <h2 className="text-xl font-semibold">📝 Đăng ký lịch học</h2>
      <div>
        <label className="block mb-1 text-white">Tên môn học:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 w-full rounded bg-gray-800 text-white"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-white">Thời gian bắt đầu:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border px-2 py-1 w-full rounded bg-gray-800 text-white"
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-white">Thời gian kết thúc:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border px-2 py-1 w-full rounded bg-gray-800 text-white"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Thêm lịch học
      </button>
    </form>
  );
}
