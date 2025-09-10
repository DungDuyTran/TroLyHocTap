"use client";

// orm nhập dữ liệu sự kiện (môn học, thời gian bắt đầu, kết thúc).
// onAdd: callback khi submit form để truyền dữ liệu lên RegisterSchedulePage.

import React, { useState } from "react";

interface Props {
  onAdd: (event: { title: string; start: string; end: string }) => void;
}

export default function ScheduleForm({ onAdd }: Props) {
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
    <div className="flex justify-center ml-[300px]">
      {" "}
      <form
        onSubmit={handleSubmit}
        className="bg-[#1f2937] p-6 rounded-lg shadow-lg w-[650px] mt-9 space-y-4"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          📝 Thêm lịch học
        </h2>

        <input
          type="text"
          placeholder="Tên môn học"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-[#111827] text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="w-full p-3 rounded bg-[#111827] text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="w-full p-3 rounded bg-[#111827] text-white outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className=" flex justify-center ml-[200px] w-[200px] py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition duration-200"
        >
          Thêm lịch học
        </button>
      </form>
    </div>
  );
}
