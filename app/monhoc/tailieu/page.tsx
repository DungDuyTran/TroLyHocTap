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
  monHoc?: MonHoc; // This is populated by frontend after fetching MonHoc list
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

  // Updated API URL to directly interact with TaiLieu endpoint
  const API_URL = "http://localhost:3000/api/taiLieu";
  const MONHOC_API_URL = "http://localhost:3000/api/monHoc";

  // Effect to read monHocId from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const monHocIdParam = params.get("id");
    if (monHocIdParam) {
      setSelectedMonHocFilter(parseInt(monHocIdParam));
    }
  }, []);

  // Fetch list of MonHoc for the filter dropdown
  const fetchMonHocForFilter = async () => {
    try {
      const response = await fetch(MONHOC_API_URL);
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

  // Fetch list of TaiLieu based on selected filter
  const fetchTaiLieu = async () => {
    try {
      let apiUrl = API_URL;
      if (selectedMonHocFilter !== "all") {
        apiUrl += `?monHocId=${selectedMonHocFilter}`;
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Assuming API now returns TaiLieu objects directly, and might include monHoc
      const result = await response.json();
      const data: TaiLieu[] = (result.data || []).map((item: any) => ({
        id: item.id,
        tenFile: item.tenFile || "Không có thông tin",
        huongDan: item.huongDan || "Không có thông tin",
        ghiChu: item.ghiChu || "Không có thông tin",
        noiDung: item.noiDung || "Không có nội dung tài liệu được cung cấp.",
        fileUrl: item.fileUrl || "",
        ngayTao: item.ngayTao || new Date().toISOString(),
        monHocId: item.monHocId,
        // Populate monHoc by finding it from the fetched danhSachMonHoc
        monHoc: danhSachMonHoc.find((mh) => mh.id === item.monHocId),
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

  // Fetch MonHoc on component mount
  useEffect(() => {
    fetchMonHocForFilter();
  }, []);

  // Fetch TaiLieu when filter changes or MonHoc list is loaded
  // Added a check for danhSachMonHoc.length to ensure monHoc data is available for mapping
  useEffect(() => {
    if (danhSachMonHoc.length > 0 || selectedMonHocFilter === "all") {
      fetchTaiLieu();
    }
  }, [selectedMonHocFilter, danhSachMonHoc]); // Re-fetch when filter or MonHoc list changes

  // Show notification popup
  const showNotification = (message: string, isSuccess: boolean) => {
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  // Handle adding a new document
  const handleAddTaiLieu = async (newTaiLieuData: TaiLieuFormData) => {
    try {
      const response = await fetch(API_URL, {
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

  // Handle updating an existing document
  const handleUpdateTaiLieu = async (updatedTaiLieuData: TaiLieu) => {
    try {
      const response = await fetch(`${API_URL}/${updatedTaiLieuData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTaiLieuData),
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
      setShowEditModal(false);
      setSelectedTaiLieu(null);
      showNotification("Cập nhật tài liệu thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật tài liệu:", error);
      showNotification(`Cập nhật tài liệu thất bại: ${error.message}`, false);
    }
  };

  // Handle deleting a document
  const handleDeleteTaiLieu = async (id: number) => {
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
          className="px-6 py-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center"
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
        {danhSachTaiLieu.length > 0 ? (
          danhSachTaiLieu.map((taiLieuItem) => {
            const createdAt = new Date(taiLieuItem.ngayTao);
            const formattedDate = !isNaN(createdAt.getTime())
              ? createdAt.toLocaleDateString("vi-VN")
              : "Không có thông tin ngày tạo";

            return (
              <div
                key={taiLieuItem.id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all duration-200 flex flex-col"
              >
                <div className="flex-grow">
                  {" "}
                  {/* This div ensures content pushes buttons to the bottom */}
                  <h2 className="text-xl font-bold mb-2 text-yellow-300">
                    📚 {taiLieuItem.tenFile}
                  </h2>
                  <p className="text-gray-300 text-sm mb-1">
                    � Hướng dẫn:{" "}
                    <span className="font-medium line-clamp-2">
                      {taiLieuItem.huongDan || "Không có thông tin"}
                    </span>
                  </p>
                  <p className="text-gray-400 text-sm mb-1">
                    📝 Ghi chú:{" "}
                    <span className="line-clamp-2">
                      {taiLieuItem.ghiChu || "Không có thông tin"}
                    </span>
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
                </div>
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
          })
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            Không có tài liệu nào được tìm thấy.
          </p>
        )}
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
  const [huongDan, setHuongDan] = useState<string>("");
  const [ghiChu, setGhiChu] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monHocId === "") {
      // Using console.error instead of alert based on instructions
      console.error("Vui lòng chọn môn học!");
      return;
    }
    onSubmit({
      tenFile,
      huongDan,
      ghiChu,
      noiDung,
      fileUrl: "",
      monHocId: monHocId as number,
    });
  };

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
          <div className="mb-4">
            <label
              htmlFor="huongDan"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Hướng dẫn
            </label>
            <input
              type="text"
              id="huongDan"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={huongDan}
              onChange={(e) => setHuongDan(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="ghiChu"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Ghi chú
            </label>
            <input
              type="text"
              id="ghiChu"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
            />
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 mt-12">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-2xl border border-green-500 max-h-[85vh] overflow-y-auto pb-12">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          {/* Tên File */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="tenFile"
              className="w-32 font-bold text-sm text-gray-300"
            >
              Tên File
            </label>
            <input
              type="text"
              id="tenFile"
              className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedTaiLieu.tenFile}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Nội dung */}
          <div>
            <label
              htmlFor="noiDung"
              className="block text-sm font-bold mb-2 text-gray-300"
            >
              Nội dung tài liệu (văn bản)
            </label>
            <textarea
              id="noiDung"
              rows={4}
              className="w-full py-2 px-3 bg-gray-700 border border-gray-600 rounded-md resize-y overflow-y-auto focus:outline-none focus:ring-2 focus:ring-green-500 mb-1"
              value={editedTaiLieu.noiDung}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          {/* Hướng dẫn */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="huongDan"
              className="w-32 font-bold text-sm text-gray-300"
            >
              Hướng dẫn
            </label>
            <input
              type="text"
              id="huongDan"
              className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedTaiLieu.huongDan}
              onChange={handleInputChange}
            />
          </div>

          {/* Ghi chú */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="ghiChu"
              className="w-32 font-bold text-sm text-gray-300"
            >
              Ghi chú
            </label>
            <input
              type="text"
              id="ghiChu"
              className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedTaiLieu.ghiChu}
              onChange={handleInputChange}
            />
          </div>

          {/* Môn học */}
          <div className="flex items-center space-x-4">
            <label
              htmlFor="monHocId"
              className="w-32 font-bold text-sm text-gray-300"
            >
              Môn Học
            </label>
            <select
              id="monHocId"
              className="flex-1 py-2 px-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
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

          {/* Buttons */}
          <div className="flex items-center justify-between mt-2">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-md transition-colors duration-200 flex items-center space-x-2"
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl max-w-2xl border border-yellow-500 max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400 flex items-center justify-center space-x-3">
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

        <div className="space-y-4 text-white text-base">
          <div className="bg-gray-700 p-3 rounded-md max-h-60 overflow-y-auto">
            <span className="font-semibold text-gray-300">
              Nội dung tài liệu (văn bản):
            </span>
            <p className="text-gray-200 mt-2 whitespace-pre-wrap">
              {taiLieu.noiDung || "Không có nội dung tài liệu được cung cấp."}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onClose}
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
