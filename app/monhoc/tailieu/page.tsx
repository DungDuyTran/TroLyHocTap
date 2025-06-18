// 2. Trang tài liệu - /dashboard/monhoc/tailieu/page.tsx
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TaiLieuPage() {
  const searchParams = useSearchParams();
  const monHoc = searchParams.get("mon") || "Tài liệu học";

  const [fileList, setFileList] = useState<File[]>([]);
  const [newText, setNewText] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileList([...fileList, ...Array.from(e.target.files)]);
    }
  };

  const handleAddText = () => {
    if (newText.trim()) {
      const blob = new Blob([newText], { type: "text/plain" });
      const file = new File([blob], `tailieu_${Date.now()}.txt`, {
        type: "text/plain",
      });
      setFileList([...fileList, file]);
      setNewText("");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">
        📂 Tài liệu: {monHoc}
      </h1>

      <div className="bg-[#1D2636] p-4 rounded shadow mb-6">
        <label className="block text-sm font-medium mb-2">
          📤 Upload tài liệu:
        </label>
        <input
          type="file"
          multiple
          onChange={handleUpload}
          className="text-white"
        />
      </div>

      <div className="bg-[#1D2636] p-4 rounded shadow mb-6">
        <label className="block text-sm font-medium mb-2">
          ✍️ Tạo tài liệu mới:
        </label>
        <textarea
          className="w-full bg-gray-800 text-white p-2 rounded"
          rows={4}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        ></textarea>
        <button
          onClick={handleAddText}
          className="mt-2 px-4 py-1 bg-green-600 rounded hover:bg-green-700"
        >
          ➕ Thêm
        </button>
      </div>

      <div className="bg-[#1D2636] p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">📄 Danh sách tài liệu:</h2>
        {fileList.length === 0 ? (
          <p className="text-sm text-gray-400">Chưa có tài liệu nào.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {fileList.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
