"use client";

import React, { useState, useEffect } from "react";

interface MonHoc {
  id: number;
  tenMon: string;
  giangVien: string;
  moTa: string;
}

interface KyThi_MonHoc {
  kyThiId: number;
  monHocId: number;
  monHoc: MonHoc;
}

interface KyThi {
  id: number;
  tenKyThi: string;
  ghiChu?: string;
  thoiGianThi: string;
  kyThiMonHoc: KyThi_MonHoc[];
  daThamGia?: boolean; // Đã thêm lại trường này
}

interface KyThiFormData {
  tenKyThi: string;
  ghiChu?: string;
  thoiGianThi: string;
  monHocIds: number[];
  daThamGia?: boolean; // Thêm vào form data để khi POST có thể truyền giá trị khởi tạo
}

export default function LichThiPage() {
  const [danhSachKyThi, setDanhSachKyThi] = useState<KyThi[]>([]);
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<MonHoc[]>([]);
  const [selectedMonHocFilter, setSelectedMonHocFilter] = useState<
    number | "all"
  >("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedKyThi, setSelectedKyThi] = useState<KyThi | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [isSuccessNotification, setIsSuccessNotification] =
    useState<boolean>(true);
  const [showViewerModal, setShowViewerModal] = useState<boolean>(false);
  const [selectedKyThiForView, setSelectedKyThiForView] =
    useState<KyThi | null>(null);

  const KYTHI_API_URL = "http://localhost:3000/api/kyThi";
  const MONHOC_API_URL = "http://localhost:3000/api/monHoc";
  const KYTHI_MONHOC_API_URL = "http://localhost:3000/api/kyThi_monHoc";

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

  const fetchKyThi = async () => {
    try {
      let apiUrl = `${KYTHI_API_URL}?daThamGia=false`; // Lọc chỉ những kỳ thi CHƯA tham gia
      const queryParams = [];

      if (selectedMonHocFilter !== "all") {
        queryParams.push(`monHocId=${selectedMonHocFilter}`);
      }

      if (queryParams.length > 0) {
        apiUrl += `&${queryParams.join("&")}`; // Thêm queryParams bằng & nếu đã có daThamGia
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const transformedData: KyThi[] = (result.data || []).map((item: any) => ({
        id: item.id,
        tenKyThi: item.tenKyThi || "Không có thông tin",
        ghiChu: item.ghiChu || "Không có thông tin",
        thoiGianThi: item.thoiGianThi || new Date().toISOString(),
        kyThiMonHoc: item.kyThiMonHoc || [],
        daThamGia: item.daThamGia || false, // Đảm bảo trường này được đọc
      }));
      setDanhSachKyThi(transformedData);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách kỳ thi:", error);
      showNotification(`Lỗi khi tải danh sách kỳ thi: ${error.message}`, false);
    }
  };

  useEffect(() => {
    fetchMonHocForFilter();
  }, []);

  useEffect(() => {
    if (danhSachMonHoc.length > 0 || selectedMonHocFilter === "all") {
      fetchKyThi();
    }
  }, [selectedMonHocFilter, danhSachMonHoc]);

  const showNotification = (message: string, isSuccess: boolean) => {
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const handleAddKyThi = async (newKyThiData: KyThiFormData) => {
    try {
      const { monHocIds, ...restKyThiData } = newKyThiData;

      const kyThiResponse = await fetch(KYTHI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...restKyThiData,
          thoiGianThi: new Date(restKyThiData.thoiGianThi).toISOString(),
          daThamGia: false, // Mặc định là false khi tạo mới
        }),
      });

      if (!kyThiResponse.ok) {
        const errorData = await kyThiResponse
          .json()
          .catch(() => ({ message: "Không thể đọc phản hồi lỗi." }));
        throw new Error(
          `HTTP error! status: ${
            kyThiResponse.status
          }, message: ${JSON.stringify(errorData)}`
        );
      }

      const createdKyThi = await kyThiResponse.json();
      const kyThiId = createdKyThi.data[0].id;

      if (monHocIds && monHocIds.length > 0) {
        for (const monHocId of monHocIds) {
          const kyThiMonHocResponse = await fetch(KYTHI_MONHOC_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kyThiId: kyThiId, monHocId: monHocId }),
          });
          if (!kyThiMonHocResponse.ok && kyThiMonHocResponse.status !== 409) {
            const errorData = await kyThiMonHocResponse
              .json()
              .catch(() => ({
                message: "Không thể đọc phản hồi lỗi quan hệ.",
              }));
            console.error(
              `Lỗi tạo quan hệ KyThi_MonHoc: ${JSON.stringify(errorData)}`
            );
          }
        }
      }

      await fetchKyThi();
      setShowAddModal(false);
      showNotification("Thêm kỳ thi thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi thêm kỳ thi:", error);
      showNotification(`Thêm kỳ thi thất bại: ${error.message}`, false);
    }
  };

  const handleUpdateKyThi = async (updatedKyThiData: KyThiFormData) => {
    try {
      const { monHocIds, ...restKyThiData } = updatedKyThiData;
      const kyThiId = selectedKyThi?.id;
      if (!kyThiId) throw new Error("Không tìm thấy ID kỳ thi để cập nhật.");

      const kyThiResponse = await fetch(`${KYTHI_API_URL}/${kyThiId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenKyThi: restKyThiData.tenKyThi,
          ghiChu: restKyThiData.ghiChu,
          thoiGianThi: new Date(restKyThiData.thoiGianThi).toISOString(),
          // daThamGia không được thay đổi ở đây, nó được xử lý riêng bởi handleToggleDaThamGia
        }),
      });

      if (!kyThiResponse.ok) {
        const errorData = await kyThiResponse
          .json()
          .catch(() => ({ message: "Không thể đọc phản hồi lỗi." }));
        throw new Error(
          `HTTP error! status: ${
            kyThiResponse.status
          }, message: ${JSON.stringify(errorData)}`
        );
      }

      const currentKyThiMonHoc = selectedKyThi?.kyThiMonHoc || [];
      for (const kymh of currentKyThiMonHoc) {
        await fetch(KYTHI_MONHOC_API_URL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kyThiId: kyThiId, monHocId: kymh.monHocId }),
        });
      }

      if (monHocIds && monHocIds.length > 0) {
        for (const monHocId of monHocIds) {
          const kyThiMonHocResponse = await fetch(KYTHI_MONHOC_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kyThiId: kyThiId, monHocId: monHocId }),
          });
          if (!kyThiMonHocResponse.ok && kyThiMonHocResponse.status !== 409) {
            const errorData = await kyThiMonHocResponse
              .json()
              .catch(() => ({
                message: "Không thể đọc phản hồi lỗi quan hệ.",
              }));
            console.error(
              `Lỗi tạo quan hệ KyThi_MonHoc: ${JSON.stringify(errorData)}`
            );
          }
        }
      }

      await fetchKyThi();
      setShowEditModal(false);
      setSelectedKyThi(null);
      showNotification("Cập nhật kỳ thi thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật kỳ thi:", error);
      showNotification(`Cập nhật kỳ thi thất bại: ${error.message}`, false);
    }
  };

  const handleDeleteKyThi = async (id: number) => {
    try {
      const kyThiToDelete = danhSachKyThi.find((k) => k.id === id);
      if (kyThiToDelete && kyThiToDelete.kyThiMonHoc) {
        for (const kymh of kyThiToDelete.kyThiMonHoc) {
          await fetch(KYTHI_MONHOC_API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kyThiId: id, monHocId: kymh.monHocId }),
          });
        }
      }

      const response = await fetch(`${KYTHI_API_URL}/${id}`, {
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
      await fetchKyThi();
      setSelectedKyThi(null);
      setIsDeleting(false);
      showNotification("Xóa kỳ thi thành công!", true);
    } catch (error: any) {
      console.error("Lỗi khi xóa kỳ thi:", error);
      showNotification(`Xóa kỳ thi thất bại: ${error.message}`, false);
    }
  };

  const handleToggleDaThamGia = async (kyThi: KyThi) => {
    try {
      const updatedStatus = !kyThi.daThamGia; // Đảo ngược trạng thái
      const response = await fetch(`${KYTHI_API_URL}/${kyThi.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daThamGia: updatedStatus }),
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
      await fetchKyThi(); // Tải lại danh sách để ẩn kỳ thi đã đánh dấu
      showNotification(
        `Đã ${
          updatedStatus ? "đánh dấu đã tham gia" : "bỏ đánh dấu đã tham gia"
        }`,
        true
      );
    } catch (error: any) {
      console.error("Lỗi khi cập nhật trạng thái tham gia:", error);
      showNotification(
        `Cập nhật trạng thái tham gia thất bại: ${error.message}`,
        false
      );
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-green-400 drop-shadow-lg">
        🗓️ Quản lý Lịch Thi
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
          Thêm lịch thi mới
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
        {danhSachKyThi.length > 0 ? (
          danhSachKyThi.map((kyThiItem) => {
            const ngayThi = new Date(kyThiItem.thoiGianThi);
            const formattedDate = !isNaN(ngayThi.getTime())
              ? ngayThi.toLocaleDateString("vi-VN")
              : "Không có thông tin ngày thi";
            const formattedTime = !isNaN(ngayThi.getTime())
              ? ngayThi.toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Không có thông tin";

            const monHocNames =
              kyThiItem.kyThiMonHoc
                .map((kymh) => kymh.monHoc?.tenMon)
                .filter((name) => name)
                .join(", ") || "N/A";

            return (
              <div
                key={kyThiItem.id}
                className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all duration-200 flex flex-col relative"
              >
                {/* Ngôi sao ở góc phải trên */}
                <button
                  onClick={() => handleToggleDaThamGia(kyThiItem)}
                  className="absolute top-3 right-3 p-1 rounded-full text-white z-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label={
                    kyThiItem.daThamGia
                      ? "Bỏ đánh dấu đã tham gia"
                      : "Đánh dấu đã tham gia"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-7 w-7 transition-colors duration-200 ${
                      kyThiItem.daThamGia ? "text-yellow-400" : "text-gray-400"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.929 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                </button>

                <div className="flex-grow">
                  <h2 className="text-xl font-bold mb-2 text-yellow-300">
                    📅 {kyThiItem.tenKyThi}
                  </h2>
                  <p className="text-gray-300 text-sm mb-1">
                    📚 Môn học:{" "}
                    <span className="font-medium">{monHocNames}</span>
                  </p>
                  <p className="text-gray-400 text-xs mb-1">
                    ⏰ Thời gian: {formattedTime}
                  </p>
                  <p className="text-gray-400 text-xs mb-1">
                    📍 Phòng thi: {"Không có thông tin"}
                  </p>
                  <p className="text-gray-400 text-xs mb-3">
                    🗓️ Ngày thi: {formattedDate}
                  </p>
                  {kyThiItem.ghiChu && (
                    <p className="text-gray-400 text-xs mb-3">
                      📝 Ghi chú: {kyThiItem.ghiChu}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => {
                      setSelectedKyThiForView(kyThiItem);
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
                      setSelectedKyThi(kyThiItem);
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
                      setSelectedKyThi(kyThiItem);
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
            Không có kỳ thi nào được tìm thấy.
          </p>
        )}
      </div>

      {showAddModal && (
        <KyThiAddModal
          title="Thêm Lịch Thi Mới"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddKyThi}
          danhSachMonHoc={danhSachMonHoc}
        />
      )}

      {showEditModal && selectedKyThi && (
        <KyThiEditModal
          title="Sửa Thông Tin Kỳ Thi"
          kyThi={selectedKyThi}
          onClose={() => {
            setShowEditModal(false);
            setSelectedKyThi(null);
          }}
          onSubmit={handleUpdateKyThi}
          danhSachMonHoc={danhSachMonHoc}
        />
      )}

      {isDeleting && selectedKyThi && (
        <ConfirmationModal
          message={`Bạn có chắc chắn muốn xóa kỳ thi "${selectedKyThi.tenKyThi}" không?`}
          onConfirm={() => handleDeleteKyThi(selectedKyThi.id)}
          onCancel={() => {
            setIsDeleting(false);
            setSelectedKyThi(null);
          }}
        />
      )}

      {showViewerModal && selectedKyThiForView && (
        <KyThiViewerModal
          kyThi={selectedKyThiForView}
          onClose={() => {
            setShowViewerModal(false);
            setSelectedKyThiForView(null);
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

interface KyThiAddModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (data: KyThiFormData) => Promise<void> | void;
  danhSachMonHoc: MonHoc[];
}

function KyThiAddModal({
  title,
  onClose,
  onSubmit,
  danhSachMonHoc,
}: KyThiAddModalProps) {
  const [tenKyThi, setTenKyThi] = useState<string>("");
  const [ghiChu, setGhiChu] = useState<string>("");
  const [thoiGianThi, setThoiGianThi] = useState<string>("");
  const [selectedMonHocIds, setSelectedMonHocIds] = useState<number[]>([]);

  const handleMonHocSelection = (monHocId: number) => {
    setSelectedMonHocIds((prev) =>
      prev.includes(monHocId)
        ? prev.filter((id) => id !== monHocId)
        : [...prev, monHocId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMonHocIds.length === 0) {
      console.error("Vui lòng chọn ít nhất một môn học!");
      return;
    }
    onSubmit({
      tenKyThi,
      ghiChu,
      thoiGianThi,
      monHocIds: selectedMonHocIds,
    });
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
              htmlFor="tenKyThi"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Tên Kỳ Thi
            </label>
            <input
              type="text"
              id="tenKyThi"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={tenKyThi}
              onChange={(e) => setTenKyThi(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="thoiGianThi"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Thời Gian Thi (Ngày và Giờ)
            </label>
            <input
              type="datetime-local"
              id="thoiGianThi"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={thoiGianThi}
              onChange={(e) => setThoiGianThi(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="ghiChu"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Ghi chú (Tùy chọn)
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
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Chọn Môn Học Liên Quan
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-600 rounded-md p-2 bg-gray-700">
              {danhSachMonHoc.map((mon) => (
                <div key={mon.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`monHoc-${mon.id}`}
                    checked={selectedMonHocIds.includes(mon.id)}
                    onChange={() => handleMonHocSelection(mon.id)}
                    className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                  />
                  <label
                    htmlFor={`monHoc-${mon.id}`}
                    className="ml-2 text-gray-300"
                  >
                    {mon.tenMon}
                  </label>
                </div>
              ))}
            </div>
            {selectedMonHocIds.length === 0 && (
              <p className="text-red-400 text-xs mt-1">
                Vui lòng chọn ít nhất một môn học.
              </p>
            )}
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

interface KyThiEditModalProps {
  title: string;
  kyThi: KyThi;
  onClose: () => void;
  onSubmit: (data: KyThiFormData) => Promise<void> | void;
  danhSachMonHoc: MonHoc[];
}

function KyThiEditModal({
  title,
  kyThi,
  onClose,
  onSubmit,
  danhSachMonHoc,
}: KyThiEditModalProps) {
  const [editedKyThi, setEditedKyThi] = useState<KyThi>(kyThi);
  const [selectedMonHocIds, setSelectedMonHocIds] = useState<number[]>(
    kyThi.kyThiMonHoc.map((kymh) => kymh.monHocId)
  );

  useEffect(() => {
    setEditedKyThi({
      ...kyThi,
      thoiGianThi: new Date(kyThi.thoiGianThi).toISOString().slice(0, 16),
    });
    setSelectedMonHocIds(kyThi.kyThiMonHoc.map((kymh) => kymh.monHocId));
  }, [kyThi]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEditedKyThi((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleMonHocSelection = (monHocId: number) => {
    setSelectedMonHocIds((prev) =>
      prev.includes(monHocId)
        ? prev.filter((id) => id !== monHocId)
        : [...prev, monHocId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMonHocIds.length === 0) {
      console.error("Vui lòng chọn ít nhất một môn học!");
      return;
    }
    onSubmit({
      tenKyThi: editedKyThi.tenKyThi,
      ghiChu: editedKyThi.ghiChu,
      thoiGianThi: editedKyThi.thoiGianThi,
      monHocIds: selectedMonHocIds,
    });
  };

  if (!editedKyThi) {
    console.error("KyThiEditModal: kyThi prop is null or undefined.");
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-md border border-green-600 mt-[20px]">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-400">
          {title}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tenKyThi"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Tên Kỳ Thi
            </label>
            <input
              type="text"
              id="tenKyThi"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedKyThi.tenKyThi}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="thoiGianThi"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Thời Gian Thi (Ngày và Giờ)
            </label>
            <input
              type="datetime-local"
              id="thoiGianThi"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedKyThi.thoiGianThi}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="ghiChu"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Ghi chú (Tùy chọn)
            </label>
            <input
              type="text"
              id="ghiChu"
              className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              value={editedKyThi.ghiChu || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Chọn Môn Học Liên Quan
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-600 rounded-md p-2 bg-gray-700">
              {danhSachMonHoc.map((mon) => (
                <div key={mon.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`monHocEdit-${mon.id}`}
                    checked={selectedMonHocIds.includes(mon.id)}
                    onChange={() => handleMonHocSelection(mon.id)}
                    className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                  />
                  <label
                    htmlFor={`monHocEdit-${mon.id}`}
                    className="ml-2 text-gray-300"
                  >
                    {mon.tenMon}
                  </label>
                </div>
              ))}
            </div>
            {selectedMonHocIds.length === 0 && (
              <p className="text-red-400 text-xs mt-1">
                Vui lòng chọn ít nhất một môn học.
              </p>
            )}
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

interface KyThiViewerModalProps {
  kyThi: KyThi;
  onClose: () => void;
}

function KyThiViewerModal({ kyThi, onClose }: KyThiViewerModalProps) {
  if (!kyThi) {
    return null;
  }

  const ngayThi = new Date(kyThi.thoiGianThi);
  const formattedDate = !isNaN(ngayThi.getTime())
    ? ngayThi.toLocaleDateString("vi-VN")
    : "Không có thông tin ngày thi";
  const formattedTime = !isNaN(ngayThi.getTime())
    ? ngayThi.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Không có thông tin";

  const monHocNames =
    kyThi.kyThiMonHoc
      .map((kymh) => kymh.monHoc?.tenMon)
      .filter((name) => name)
      .join(", ") || "N/A";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-7 rounded-lg shadow-xl w-full max-w-xl border border-yellow-500">
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
          <span>Xem Kỳ Thi: {kyThi.tenKyThi}</span>
        </h2>
        <div className="space-y-4 text-white text-base">
          <div className="bg-gray-700 p-3 rounded-md overflow-y-auto">
            <p className="mb-2">
              <span className="font-semibold text-gray-300">Tên kỳ thi:</span>{" "}
              <span className="text-gray-200">{kyThi.tenKyThi}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-300">Ngày thi:</span>{" "}
              <span className="text-gray-200">{formattedDate}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-300">Thời gian:</span>{" "}
              <span className="text-gray-200">{formattedTime}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-300">Phòng thi:</span>{" "}
              <span className="text-gray-200">{"Không có thông tin"}</span>
            </p>
            <p className="mb-2">
              <span className="font-semibold text-gray-300">Môn học:</span>{" "}
              <span className="text-gray-200">{monHocNames}</span>
            </p>
            {kyThi.ghiChu && (
              <p className="mb-2">
                <span className="font-semibold text-gray-300">Ghi chú:</span>{" "}
                <span className="text-gray-200">{kyThi.ghiChu}</span>
              </p>
            )}
            <p className="mb-2">
              <span className="font-semibold text-gray-300">Đã tham gia:</span>{" "}
              <span className="text-gray-200">
                {kyThi.daThamGia ? "Có" : "Không"}
              </span>
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
