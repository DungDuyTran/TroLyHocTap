"use client";

import React, { useState, useEffect } from "react";

// Interfaces
interface GhiChu {
  id: number;
  noiDung: string;
  ngayTao: string;
  userId: number;
  isQuanTrong?: boolean; // Added isQuanTrong field
}

interface GhiChuFormData {
  noiDung: string;
  ngayTao: string;
  userId: number;
  isQuanTrong?: boolean; // Added isQuanTrong field
}

// Main Component
export default function GhiChuPage() {
  const [danhSachGhiChu, setDanhSachGhiChu] = useState<GhiChu[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedGhiChu, setSelectedGhiChu] = useState<GhiChu | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [isSuccessNotification, setIsSuccessNotification] =
    useState<boolean>(true);
  const [showViewerModal, setShowViewerModal] = useState<boolean>(false);
  const [selectedGhiChuForView, setSelectedGhiChuForView] =
    useState<GhiChu | null>(null);
  const [showImportantOnly, setShowImportantOnly] = useState<boolean>(false); // State for filtering important notes

  const API_URL = "http://localhost:3000/api/ghiChu";

  // Function to fetch notes
  const fetchGhiChu = async () => {
    try {
      let apiUrl = API_URL;
      if (showImportantOnly) {
        apiUrl += `?isQuanTrong=true`; // Add filter parameter if showing important notes only
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setDanhSachGhiChu(result.data || []);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách ghi chú:", error);
      showNotification(
        `Lỗi khi tải danh sách ghi chú: ${error.message}`,
        false
      );
    }
  };

  // Fetch notes on component mount and when filter changes
  useEffect(() => {
    fetchGhiChu();
  }, [showImportantOnly]);

  // Show notification popup
  const showNotification = (message: string, isSuccess: boolean) => {
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  // Handle adding a new note
  const handleAddGhiChu = async (newGhiChuData: GhiChuFormData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGhiChuData),
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
      await fetchGhiChu();
      setShowAddModal(false);
      showNotification("Thêm ghi chú thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi thêm ghi chú:", error);
      showNotification(`Thêm ghi chú thất bại: ${error.message}`, false);
    }
  };

  // Handle updating an existing note
  const handleUpdateGhiChu = async (updatedGhiChuData: GhiChu) => {
    try {
      const response = await fetch(`${API_URL}/${updatedGhiChuData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGhiChuData),
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
      await fetchGhiChu();
      setShowEditModal(false);
      setSelectedGhiChu(null);
      showNotification("Cập nhật ghi chú thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật ghi chú:", error);
      showNotification(`Cập nhật ghi chú thất bại: ${error.message}`, false);
    }
  };

  // Handle deleting a note
  const handleDeleteGhiChu = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
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
      await fetchGhiChu();
      setSelectedGhiChu(null);
      setIsDeleting(false);
      showNotification("Xóa ghi chú thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi xóa ghi chú:", error);
      showNotification(`Xóa ghi chú thất bại: ${error.message}`, false);
    }
  };

  // Toggle importance status of a note
  const handleToggleQuanTrong = async (ghiChu: GhiChu) => {
    try {
      const updatedStatus = !ghiChu.isQuanTrong;
      const response = await fetch(`${API_URL}/${ghiChu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isQuanTrong: updatedStatus }),
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
      // Optimistically update the local state for immediate feedback
      setDanhSachGhiChu((prev) =>
        prev.map((item) =>
          item.id === ghiChu.id ? { ...item, isQuanTrong: updatedStatus } : item
        )
      );
      showNotification(
        `Đã ${updatedStatus ? "đánh dấu" : "bỏ đánh dấu"} quan trọng`,
        true
      );
    } catch (error: any) {
      console.error("Lỗi khi cập nhật trạng thái quan trọng:", error);
      showNotification(
        `Cập nhật trạng thái quan trọng thất bại: ${error.message}`,
        false
      );
    }
  };

  return (
    <div className="min-h-screen p-[30px] bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-green-400 drop-shadow-lg">
        📝 Quản lý Ghi Chú
      </h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center"
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
          Thêm ghi chú mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {danhSachGhiChu.length > 0 ? (
          danhSachGhiChu.map((ghiChuItem) => {
            const createdAt = new Date(ghiChuItem.ngayTao);
            const formattedDate = !isNaN(createdAt.getTime())
              ? createdAt.toLocaleDateString("vi-VN")
              : "Không có thông tin ngày tạo";

            return (
              <div
                key={ghiChuItem.id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all duration-200 flex flex-col relative"
              >
                {/* Star icon for importance */}
                <button
                  onClick={() => handleToggleQuanTrong(ghiChuItem)}
                  className="absolute top-3 right-3 p-1 rounded-full text-white z-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label={
                    ghiChuItem.isQuanTrong
                      ? "Bỏ đánh dấu quan trọng"
                      : "Đánh dấu quan trọng"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-7 w-7 transition-colors duration-200 ${
                      ghiChuItem.isQuanTrong
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                </button>

                <div className="flex-grow">
                  <h2 className="text-xl font-bold mb-2 text-yellow-300">
                    Ghi chú #{ghiChuItem.id}
                  </h2>
                  <p className="text-gray-300 text-sm mb-1">
                    ✍️ Nội dung:{" "}
                    <span className="font-medium line-clamp-2">
                      {ghiChuItem.noiDung}
                    </span>
                  </p>
                  <p className="text-gray-400 text-xs mb-3">
                    🗓️ Ngày tạo: {formattedDate}
                  </p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setSelectedGhiChuForView(ghiChuItem);
                      setShowViewerModal(true);
                    }}
                    className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 text-white text-sm font-semibold flex items-center space-x-1"
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>Xem</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGhiChu(ghiChuItem);
                      setShowEditModal(true);
                    }}
                    className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 text-white text-sm font-semibold flex items-center space-x-1"
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
                    onClick={() => {
                      setSelectedGhiChu(ghiChuItem);
                      setIsDeleting(true);
                    }}
                    className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 text-white text-sm font-semibold flex items-center space-x-1"
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
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            Không có ghi chú nào được tìm thấy.
          </p>
        )}
      </div>

      {showAddModal && (
        <GhiChuAddModal
          title="Thêm Ghi Chú Mới"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddGhiChu}
        />
      )}

      {showEditModal && selectedGhiChu && (
        <GhiChuEditModal
          title="Sửa Ghi Chú"
          ghiChu={selectedGhiChu}
          onClose={() => {
            setShowEditModal(false);
            setSelectedGhiChu(null);
          }}
          onSubmit={handleUpdateGhiChu}
        />
      )}

      {isDeleting && selectedGhiChu && (
        <ConfirmationModal
          message={`Bạn có chắc chắn muốn xóa ghi chú #${selectedGhiChu.id} không?`}
          onConfirm={() => handleDeleteGhiChu(selectedGhiChu.id)}
          onCancel={() => {
            setIsDeleting(false);
            setSelectedGhiChu(null);
          }}
        />
      )}

      {showViewerModal && selectedGhiChuForView && (
        <GhiChuViewerModal
          ghiChu={selectedGhiChuForView}
          onClose={() => {
            setShowViewerModal(false);
            setSelectedGhiChuForView(null);
          }}
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

// Reusable Modal Components (for self-containment)

interface GhiChuAddModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (data: GhiChuFormData) => Promise<void> | void;
}

function GhiChuAddModal({ title, onClose, onSubmit }: GhiChuAddModalProps) {
  const [noiDung, setNoiDung] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      noiDung,
      ngayTao: new Date().toISOString(),
      userId: 1,
      isQuanTrong: false,
    }); // Default new note to not important
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-600 mt-[20px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="noiDung"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Nội dung ghi chú
            </label>
            <textarea
              id="noiDung"
              rows={6}
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2"
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

interface GhiChuEditModalProps {
  title: string;
  ghiChu: GhiChu;
  onClose: () => void;
  onSubmit: (data: GhiChu) => Promise<void> | void;
}

function GhiChuEditModal({
  title,
  ghiChu,
  onClose,
  onSubmit,
}: GhiChuEditModalProps) {
  const [editedGhiChu, setEditedGhiChu] = useState<GhiChu>(ghiChu);

  useEffect(() => {
    setEditedGhiChu(ghiChu);
  }, [ghiChu]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditedGhiChu((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedGhiChu);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-600 mt-[20px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="noiDung"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Nội dung ghi chú
            </label>
            <textarea
              id="noiDung"
              rows={6}
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              value={editedGhiChu.noiDung}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2"
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
      </div>
    </div>
  );
}

interface GhiChuViewerModalProps {
  ghiChu: GhiChu;
  onClose: () => void;
}

function GhiChuViewerModal({ ghiChu, onClose }: GhiChuViewerModalProps) {
  if (!ghiChu) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-2xl border border-yellow-500">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-400 flex items-center justify-center space-x-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>Xem Ghi Chú: #{ghiChu.id}</span>
        </h2>
        <div className="space-y-4 text-white text-base">
          <div className="bg-gray-700 p-3 rounded-md h-96 overflow-y-auto">
            <span className="font-semibold text-gray-300">
              Nội dung ghi chú:
            </span>
            <p className="text-gray-200 mt-2 whitespace-pre-wrap">
              {ghiChu.noiDung || "Không có nội dung ghi chú được cung cấp."}
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-8 space-x-4">
          <button
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
            <span>Đóng</span>
          </button>
        </div>
      </div>
    </div>
  );
}

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
