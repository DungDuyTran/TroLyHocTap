"use client";

import React, { useState, useEffect } from "react";

interface MonHoc {
  id: number;
  tenMon: string;
  giangVien: string;
  moTa: string;
}

interface TaiLieu {
  id: number;
  tenFile: string;
  huongDan: string;
  ghiChu: string;
  noiDung: string;
  fileUrl: string;
  ngayTao: string;
  monHocId: number;
  monHoc?: MonHoc;
}

interface TaiLieuFormData {
  tenFile: string;
  huongDan: string;
  ghiChu: string;
  noiDung: string;
  fileUrl: string;
  monHocId: number;
}

export default function TaiLieuPage() {
  const [danhSachTaiLieu, setDanhSachTaiLieu] = useState<TaiLieu[]>([]);
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<MonHoc[]>([]);
  const [selectedMonHocFilter, setSelectedMonHocFilter] = useState<
    number | "all"
  >("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTaiLieu, setSelectedTaiLieu] = useState<TaiLieu | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [isSuccessNotification, setIsSuccessNotification] =
    useState<boolean>(true);
  const [showViewerModal, setShowViewerModal] = useState<boolean>(false);
  const [selectedTaiLieuForView, setSelectedTaiLieuForView] =
    useState<TaiLieu | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const monHocIdParam = params.get("id");
    if (monHocIdParam) {
      setSelectedMonHocFilter(parseInt(monHocIdParam));
    }
  }, []);

  const fetchMonHocForFilter = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/monHoc");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MonHoc[] = await response.json();
      setDanhSachMonHoc(data);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách môn học để lọc:", error);
      showNotification(
        `Lỗi khi tải danh sách môn học: ${error.message}`,
        false
      );
    }
  };

  const fetchTaiLieu = async () => {
    try {
      let apiUrl = "http://localhost:3000/api/monHoc_taiLieu";
      if (selectedMonHocFilter !== "all") {
        apiUrl += `?monHocId=${selectedMonHocFilter}`;
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const data: TaiLieu[] = (result.data || []).map((item: any) => ({
        id: item.taiLieu.id,
        tenFile: item.taiLieu.tenFile || "Không có thông tin",
        huongDan: item.taiLieu.huongDan || "Không có thông tin",
        ghiChu: item.taiLieu.ghiChu || "Không có thông tin",
        noiDung: item.noiDung || "Không có nội dung tài liệu được cung cấp.",
        fileUrl: item.taiLieu.fileUrl || "",
        ngayTao: item.taiLieu.ngayTao || new Date().toISOString(),
        monHocId: item.monHocId,
        monHoc: item.monHoc,
      }));
      setDanhSachTaiLieu(data);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách tài liệu:", error);
      showNotification(
        `Lỗi khi tải danh sách tài liệu: ${error.message}`,
        false
      );
    }
  };

  useEffect(() => {
    fetchMonHocForFilter();
  }, []);

  useEffect(() => {
    if (danhSachMonHoc.length > 0 || selectedMonHocFilter === "all") {
      fetchTaiLieu();
    }
  }, [selectedMonHocFilter, danhSachMonHoc]);

  const showNotification = (message: string, isSuccess: boolean) => {
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const handleAddTaiLieu = async (newTaiLieuData: TaiLieuFormData) => {
    try {
      const response = await fetch("http://localhost:3000/api/monHoc_taiLieu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaiLieuData),
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
      await fetchTaiLieu();
      setShowAddModal(false);
      showNotification("Thêm tài liệu thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi thêm tài liệu:", error);
      showNotification(`Thêm tài liệu thất bại: ${error.message}`, false);
    }
  };

  const handleUpdateTaiLieu = async (updatedTaiLieuData: TaiLieu) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/monHoc_taiLieu/${updatedTaiLieuData.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTaiLieuData),
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
      await fetchTaiLieu();
      setShowEditModal(false);
      setSelectedTaiLieu(null);
      showNotification("Cập nhật tài liệu thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật tài liệu:", error);
      showNotification(`Cập nhật tài liệu thất bại: ${error.message}`, false);
    }
  };

  const handleDeleteTaiLieu = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/monHoc_taiLieu/${id}`,
        {
          method: "DELETE",
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
      await fetchTaiLieu();
      setSelectedTaiLieu(null);
      setIsDeleting(false);
      showNotification("Xóa tài liệu thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi xóa tài liệu:", error);
      showNotification(`Xóa tài liệu thất bại: ${error.message}`, false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-green-400 drop-shadow-lg">
        📖 Quản lý Tài liệu Học
      </h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center"
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
          Thêm tài liệu mới
        </button>

        <div className="relative">
          <label htmlFor="monHocFilter" className="sr-only">
            Lọc theo môn học
          </label>
          <select
            id="monHocFilter"
            className="block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm text-white"
            value={selectedMonHocFilter}
            onChange={(e) =>
              setSelectedMonHocFilter(
                e.target.value === "all" ? "all" : parseInt(e.target.value)
              )
            }
          >
            <option value="all">Tất cả môn học</option>
            {danhSachMonHoc.map((mon) => (
              <option key={mon.id} value={mon.id}>
                {mon.tenMon}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {danhSachTaiLieu.map((taiLieuItem) => {
          const createdAt = new Date(taiLieuItem.ngayTao);
          const formattedDate = !isNaN(createdAt.getTime())
            ? createdAt.toLocaleDateString("vi-VN")
            : "Không có thông tin ngày tạo";

          return (
            <div
              key={taiLieuItem.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all duration-200"
            >
              <h2 className="text-xl font-bold mb-2 text-yellow-300">
                📚 {taiLieuItem.tenFile}
              </h2>
              <p className="text-gray-300 text-sm mb-1">
                💡 Hướng dẫn:{" "}
                <span className="font-medium">
                  {taiLieuItem.huongDan || "Không có thông tin"}
                </span>
              </p>
              <p className="text-gray-400 text-sm mb-1">
                📝 Ghi chú: {taiLieuItem.ghiChu || "Không có thông tin"}
              </p>
              <p className="text-gray-400 text-xs mb-3">
                🗓️ Ngày tạo: {formattedDate}
              </p>
              {taiLieuItem.monHoc && (
                <p className="text-gray-300 text-sm mb-3">
                  📘 Môn học:{" "}
                  <span className="font-medium">
                    {taiLieuItem.monHoc.tenMon}
                  </span>
                </p>
              )}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setSelectedTaiLieuForView(taiLieuItem);
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
                    setSelectedTaiLieu(taiLieuItem);
                    setShowEditModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-white text-sm font-semibold flex items-center space-x-1"
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
                    setSelectedTaiLieu(taiLieuItem);
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
        })}
      </div>

      {showAddModal && (
        <TaiLieuAddModal
          title="Thêm Tài liệu Mới"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTaiLieu}
          danhSachMonHoc={danhSachMonHoc}
        />
      )}

      {showEditModal && selectedTaiLieu && (
        <TaiLieuEditModal
          title="Sửa Thông Tin Tài liệu"
          taiLieu={selectedTaiLieu}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTaiLieu(null);
          }}
          onSubmit={handleUpdateTaiLieu}
          danhSachMonHoc={danhSachMonHoc}
        />
      )}

      {isDeleting && selectedTaiLieu && (
        <ConfirmationModal
          message={`Bạn có chắc chắn muốn xóa tài liệu "${selectedTaiLieu.tenFile}" không?`}
          onConfirm={() => handleDeleteTaiLieu(selectedTaiLieu.id)}
          onCancel={() => {
            setIsDeleting(false);
            setSelectedTaiLieu(null);
          }}
        />
      )}

      {showViewerModal && selectedTaiLieuForView && (
        <TaiLieuViewerModal
          taiLieu={selectedTaiLieuForView}
          onClose={() => {
            setShowViewerModal(false);
            setSelectedTaiLieuForView(null);
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

interface TaiLieuAddModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (data: TaiLieuFormData) => Promise<void> | void;
  danhSachMonHoc: MonHoc[];
}

function TaiLieuAddModal({
  title,
  onClose,
  onSubmit,
  danhSachMonHoc,
}: TaiLieuAddModalProps) {
  const [tenFile, setTenFile] = useState<string>("");
  const [noiDung, setNoiDung] = useState<string>("");
  const [monHocId, setMonHocId] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monHocId === "") {
      alert("Vui lòng chọn môn học!");
      return;
    }
    // Gán giá trị mặc định cho huongDan, ghiChu, fileUrl nếu chúng không được nhập
    onSubmit({
      tenFile,
      huongDan: "",
      ghiChu: "",
      noiDung,
      fileUrl: "",
      monHocId: monHocId as number,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-500 mt-[40px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tenFile"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Tên File
            </label>
            <input
              type="text"
              id="tenFile"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={tenFile}
              onChange={(e) => setTenFile(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="noiDung"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Nội dung tài liệu (văn bản)
            </label>
            <textarea
              id="noiDung"
              rows={6}
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              value={noiDung}
              onChange={(e) => setNoiDung(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              htmlFor="monHocId"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Môn Học
            </label>
            <select
              id="monHocId"
              className="block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm text-white"
              value={monHocId}
              onChange={(e) =>
                setMonHocId(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              required
            >
              <option value="">-- Chọn môn học --</option>
              {danhSachMonHoc.map((mon) => (
                <option key={mon.id} value={mon.id}>
                  {mon.tenMon}
                </option>
              ))}
            </select>
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
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 flex items-center space-x-2"
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

interface TaiLieuEditModalProps {
  title: string;
  taiLieu: TaiLieu;
  onClose: () => void;
  onSubmit: (data: TaiLieu) => Promise<void> | void;
  danhSachMonHoc: MonHoc[];
}

function TaiLieuEditModal({
  title,
  taiLieu,
  onClose,
  onSubmit,
  danhSachMonHoc,
}: TaiLieuEditModalProps) {
  const [editedTaiLieu, setEditedTaiLieu] = useState<TaiLieu>(taiLieu);

  useEffect(() => {
    setEditedTaiLieu(taiLieu);
  }, [taiLieu]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setEditedTaiLieu((prevData) => ({
      ...prevData,
      [id]: id === "monHocId" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedTaiLieu);
  };

  if (!editedTaiLieu) {
    console.error("TaiLieuEditModal: taiLieu prop is null or undefined.");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-500 mt-[20px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tenFile"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Tên File
            </label>
            <input
              type="text"
              id="tenFile"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedTaiLieu.tenFile}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="noiDung"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Nội dung tài liệu (văn bản)
            </label>
            <textarea
              id="noiDung"
              rows={6}
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              value={editedTaiLieu.noiDung}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="mb-6">
            <label
              htmlFor="monHocId"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Môn Học
            </label>
            <select
              id="monHocId"
              className="block w-full py-2 px-3 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 sm:text-sm text-white"
              value={editedTaiLieu.monHocId}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Chọn môn học --</option>
              {danhSachMonHoc.map((mon) => (
                <option key={mon.id} value={mon.id}>
                  {mon.tenMon}
                </option>
              ))}
            </select>
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

interface TaiLieuViewerModalProps {
  taiLieu: TaiLieu;
  onClose: () => void;
}

function TaiLieuViewerModal({ taiLieu, onClose }: TaiLieuViewerModalProps) {
  if (!taiLieu) {
    return null;
  }

  const handleOpenExternal = () => {
    if (taiLieu.fileUrl) {
      window.open(taiLieu.fileUrl, "_blank");
    } else {
      alert(
        "Không có URL file để mở. Vui lòng thêm URL file trong phần chỉnh sửa tài liệu."
      );
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-5 rounded-lg shadow-xl w-full max-w-3xl h-[75vh] border border-yellow-500 mt-5 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-center text-yellow-400 flex items-center justify-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-400"
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
          <span>Xem Tài liệu: {taiLieu.tenFile}</span>
        </h2>

        <div className="flex-1 overflow-y-auto space-y-4 text-white text-sm">
          <div className="bg-gray-700 p-4 rounded-md">
            <span className="font-semibold text-gray-300">
              Nội dung tài liệu (văn bản):
            </span>
            <p className="text-gray-200 mt-2 whitespace-pre-wrap">
              {taiLieu.noiDung || "Không có nội dung tài liệu được cung cấp."}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded-md flex items-center space-x-2"
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
