"use client";

import React, { useState, useEffect } from "react";

// Định nghĩa interface cho cấu trúc dữ liệu MonHoc
interface MonHoc {
  id: number;
  tenMon: string;
  giangVien: string;
  moTa: string;
}

// Định nghĩa interface cho dữ liệu form (khi thêm/sửa, không có id)
interface MonHocFormData {
  tenMon: string;
  giangVien: string;
  moTa: string;
}

export default function DanhSachMonHocPage() {
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<MonHoc[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedMonHoc, setSelectedMonHoc] = useState<MonHoc | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [isSuccessNotification, setIsSuccessNotification] =
    useState<boolean>(true);

  const fetchMonHoc = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/monHoc");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MonHoc[] = await response.json();
      setDanhSachMonHoc(data);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách môn học:", error);
      showNotification(
        `Lỗi khi tải danh sách môn học: ${error.message}`,
        false
      );
    }
  };

  useEffect(() => {
    fetchMonHoc();
  }, []);
  const showNotification = (message: string, isSuccess: boolean) => {
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const handleAddMonHoc = async (newMonHocData: MonHocFormData) => {
    try {
      const response = await fetch("http://localhost:3000/api/monHoc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMonHocData),
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Không thể đọc phản hồi lỗi." }));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }
      await fetchMonHoc();
      setShowAddModal(false);
      showNotification("Thêm môn học thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi thêm môn học:", error);
      showNotification(`Thêm môn học thất bại: ${error.message}`, false);
    }
  };

  const handleUpdateMonHoc = async (updatedMonHocData: MonHoc) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/monHoc/${updatedMonHocData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedMonHocData),
        }
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Không thể đọc phản hồi lỗi." }));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }
      await fetchMonHoc();
      setShowEditModal(false);
      setSelectedMonHoc(null);
      showNotification("Cập nhật môn học thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật môn học:", error);
      showNotification(`Cập nhật môn học thất bại: ${error.message}`, false);
    }
  };

  const handleDeleteMonHoc = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/monHoc/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Không thể đọc phản hồi lỗi." }));
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${JSON.stringify(
            errorData
          )}`
        );
      }
      await fetchMonHoc();
      setSelectedMonHoc(null);
      setIsDeleting(false);
      showNotification("Xóa môn học thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi xóa môn học:", error);
      showNotification(`Xóa môn học thất bại: ${error.message}`, false);
    }
  };

  const openEditFromDetail = (monHoc: MonHoc) => {
    setShowDetailModal(false);
    setSelectedMonHoc(monHoc);
    setShowEditModal(true);
  };

  const openDeleteFromDetail = (monHoc: MonHoc) => {
    setShowDetailModal(false);
    setSelectedMonHoc(monHoc);
    setIsDeleting(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-green-400 drop-shadow-lg">
        Danh sách môn học
      </h1>

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-6 px-6 py-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center mx-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Thêm môn học mới
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {danhSachMonHoc.map((mon, idx) => (
          <div
            key={mon.id || idx}
            className={`relative bg-gray-800 p-5 rounded-xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all duration-200 cursor-pointer flex flex-col justify-between`}
            onClick={() => {
              setSelectedMonHoc(mon);
              setShowDetailModal(true);
            }}
          >
            <div>
              <h2 className="text-xl font-bold mb-1 text-green-300">
                {mon.tenMon}
              </h2>
              <p className="text-gray-300 text-xs mb-1">
                👨‍🏫 Giảng viên:{" "}
                <span className="font-medium">{mon.giangVien}</span>
              </p>
              <p className="text-gray-400 text-sm">📝 {mon.moTa}</p>
            </div>
            {/* Nút "Tài liệu học" đã được xóa */}
          </div>
        ))}
      </div>

      {showAddModal && (
        <MonHocModalAdd
          title="Thêm Môn Học Mới"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddMonHoc}
        />
      )}

      {showEditModal && selectedMonHoc && (
        <MonHocModalEdit
          title="Sửa Thông Tin Môn Học"
          monHoc={selectedMonHoc}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMonHoc(null);
          }}
          onSubmit={handleUpdateMonHoc}
        />
      )}

      {isDeleting && selectedMonHoc && (
        <ConfirmationModal
          message={`Bạn có chắc chắn muốn xóa môn học "${selectedMonHoc.tenMon}" không?`}
          onConfirm={() => handleDeleteMonHoc(selectedMonHoc.id)}
          onCancel={() => {
            setIsDeleting(false);
            setSelectedMonHoc(null);
          }}
        />
      )}

      {showDetailModal && selectedMonHoc && (
        <MonHocDetailModal
          monHoc={selectedMonHoc}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMonHoc(null);
          }}
          onEdit={openEditFromDetail}
          onDelete={openDeleteFromDetail}
        />
      )}

      {notificationMessage && (
        <Notification
          message={notificationMessage}
          isSuccess={isSuccessNotification}
        />
      )}
    </div>
  );
}

interface MonHocModalAddProps {
  title: string;
  onClose: () => void;
  onSubmit: (data: MonHocFormData) => Promise<void> | void;
}

function MonHocModalAdd({ title, onClose, onSubmit }: MonHocModalAddProps) {
  const [tenMon, setTenMon] = useState<string>("");
  const [giangVien, setGiangVien] = useState<string>("");
  const [moTa, setMoTa] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ tenMon, giangVien, moTa });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-500">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tenMon"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Tên Môn Học
            </label>
            <input
              type="text"
              id="tenMon"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={tenMon}
              onChange={(e) => setTenMon(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="giangVien"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Giảng Viên
            </label>
            <input
              type="text"
              id="giangVien"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={giangVien}
              onChange={(e) => setGiangVien(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="moTa"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Mô Tả
            </label>
            <textarea
              id="moTa"
              rows={4}
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Thêm</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Hủy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface MonHocModalEditProps {
  title: string;
  monHoc: MonHoc;
  onClose: () => void;
  onSubmit: (data: MonHoc) => Promise<void> | void;
}

function MonHocModalEdit({
  title,
  monHoc,
  onClose,
  onSubmit,
}: MonHocModalEditProps) {
  const [editedMonHoc, setEditedMonHoc] = useState<MonHoc>(monHoc);

  useEffect(() => {
    setEditedMonHoc(monHoc);
  }, [monHoc]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEditedMonHoc((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedMonHoc);
  };

  if (!editedMonHoc) {
    console.error("MonHocModalEdit: monHoc prop is null or undefined.");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-500">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tenMon"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Tên Môn Học
            </label>
            <input
              type="text"
              id="tenMon"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedMonHoc.tenMon}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="giangVien"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Giảng Viên
            </label>
            <input
              type="text"
              id="giangVien"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedMonHoc.giangVien}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="moTa"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Mô Tả
            </label>
            <textarea
              id="moTa"
              rows={4}
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              value={editedMonHoc.moTa}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Cập nhật</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Hủy</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-sm border border-red-500">
        <h2 className="text-xl font-bold mb-4 text-red-400 text-center">
          Xác nhận
        </h2>
        <p className="text-white text-center mb-6">{message}</p>
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-md transition-colors duration-200 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Xác nhận</span>
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md transition-colors duration-200 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Hủy</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface MonHocDetailModalProps {
  monHoc: MonHoc;
  onClose: () => void;
  onEdit: (monHoc: MonHoc) => void;
  onDelete: (monHoc: MonHoc) => void;
}

function MonHocDetailModal({
  monHoc,
  onClose,
  onEdit,
  onDelete,
}: MonHocDetailModalProps) {
  if (!monHoc) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-500">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400 flex items-center justify-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Thông tin môn học</span>
        </h2>
        <div className="space-y-4 text-white text-lg">
          <div className="bg-gray-700 p-3 rounded-md">
            <span className="font-semibold text-gray-300">Tên môn:</span>{" "}
            {monHoc.tenMon}
          </div>
          <div className="bg-gray-700 p-3 rounded-md">
            <span className="font-semibold text-gray-300">Giảng viên:</span>{" "}
            {monHoc.giangVien}
          </div>
          <div className="bg-gray-700 p-3 rounded-md">
            <span className="font-semibold text-gray-300">Mô tả:</span>{" "}
            {monHoc.moTa}
          </div>
        </div>
        <div className="flex items-center justify-between mt-8 space-x-4">
          <button
            onClick={() => onEdit(monHoc)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2 w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Sửa</span>
          </button>
          <button
            onClick={() => onDelete(monHoc)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2 w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Xóa</span>
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2 w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Hủy</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Re-using Notification Component
interface NotificationProps {
  message: string;
  isSuccess: boolean;
}

function Notification({ message, isSuccess }: NotificationProps) {
  const bgColor = isSuccess ? "bg-green-500" : "bg-red-500";
  const icon = isSuccess ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <div
      className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg text-white flex items-center ${bgColor} transition-all duration-300 transform`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
