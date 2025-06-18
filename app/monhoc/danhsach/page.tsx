"use client";

import React from "react";
import Link from "next/link";

const danhSachMonHoc = [
  {
    ten: "Lập trình Web",
    giangVien: "ThS. Nguyễn Văn A",
    moTa: "Học về HTML, CSS, JavaScript, React.",
  },
  {
    ten: "Trí tuệ nhân tạo",
    giangVien: "TS. Trần B",
    moTa: "Giới thiệu AI, Machine Learning, Neural Networks.",
  },
  {
    ten: "Phát triển ứng dụng di động",
    giangVien: "ThS. Lê C",
    moTa: "React Native, Flutter và quy trình phát triển app.",
  },
];

export default function DanhSachMonHocPage() {
  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">
        📚 Danh sách môn học
      </h1>

      <div className="space-y-4">
        {danhSachMonHoc.map((mon, idx) => (
          <div key={idx} className="bg-[#1D2636] p-4 rounded shadow text-white">
            <h2 className="text-xl font-semibold">{mon.ten}</h2>
            <p className="text-sm">👨‍🏫 Giảng viên: {mon.giangVien}</p>
            <p className="text-sm">📝 {mon.moTa}</p>
            <Link
              href={`/dashboard/monhoc/tailieu?mon=${encodeURIComponent(
                mon.ten
              )}`}
              className="inline-block mt-2 px-4 py-1 bg-green-600 rounded hover:bg-green-700 text-white"
            >
              📂 Tài liệu học
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
