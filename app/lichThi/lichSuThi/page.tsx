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
  daThamGia?: boolean;
}

export default function LichSuThiPage() {
  const [danhSachKyThiDaThamGia, setDanhSachKyThiDaThamGia] = useState<KyThi[]>(
    []
  );
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<MonHoc[]>([]);
  const [selectedMonHocFilter, setSelectedMonHocFilter] = useState<
    number | "all"
  >("all");
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

  const fetchKyThiDaThamGia = async () => {
    try {
      let apiUrl = `${KYTHI_API_URL}?daThamGia=true`; // Lọc các kỳ thi đã tham gia
      const queryParams = [];

      if (selectedMonHocFilter !== "all") {
        queryParams.push(`monHocId=${selectedMonHocFilter}`);
      }

      if (queryParams.length > 0) {
        apiUrl += `&${queryParams.join("&")}`;
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
        daThamGia: item.daThamGia || false,
      }));
      setDanhSachKyThiDaThamGia(transformedData);
    } catch (error: any) {
      console.error("Lỗi khi tải danh sách kỳ thi đã tham gia:", error);
      showNotification(
        `Lỗi khi tải danh sách kỳ thi đã tham gia: ${error.message}`,
        false
      );
    }
  };

  useEffect(() => {
    fetchMonHocForFilter();
  }, []);

  useEffect(() => {
    if (danhSachMonHoc.length > 0 || selectedMonHocFilter === "all") {
      fetchKyThiDaThamGia();
    }
  }, [selectedMonHocFilter, danhSachMonHoc]);

  const showNotification = (message: string, isSuccess: boolean) => {
    setNotificationMessage(message);
    setIsSuccessNotification(isSuccess);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  const handleToggleDaThamGia = async (kyThi: KyThi) => {
    try {
      // Trên trang lịch sử, click vào ngôi sao nghĩa là BỎ đánh dấu đã tham gia (chuyển về false)
      const updatedStatus = false;
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
      // Tải lại danh sách để ẩn kỳ thi vừa bỏ đánh dấu khỏi trang lịch sử
      await fetchKyThiDaThamGia();
      showNotification(
        `Đã bỏ đánh dấu đã tham gia cho kỳ thi "${kyThi.tenKyThi}"`,
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
      <h1 className="text-4xl font-extrabold mb-8 text-center text-orange-400 drop-shadow-lg">
        📜 Lịch Sử Thi
      </h1>

      <div className="flex justify-end items-center mb-6">
        <div className="relative">
          <label htmlFor="monHocFilter" className="sr-only">
            Lọc theo môn học
          </label>
          <select
            id="monHocFilter"
            className="block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-white"
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
        {danhSachKyThiDaThamGia.length > 0 ? (
          danhSachKyThiDaThamGia.map((kyThiItem) => {
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
                className="bg-gray-800 p-6 rounded-xl shadow-lg border-2 border-transparent hover:border-orange-500 transition-all duration-200 flex flex-col relative"
              >
                {/* Ngôi sao ở góc phải trên để BỎ đánh dấu đã tham gia */}
                <button
                  onClick={() => handleToggleDaThamGia(kyThiItem)}
                  className="absolute top-3 right-3 p-1 rounded-full text-white z-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label={"Bỏ đánh dấu đã tham gia"} // Luôn là "Bỏ đánh dấu" trên trang này
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-7 w-7 transition-colors duration-200 text-yellow-400`} // Luôn màu vàng vì nó đã "đã tham gia"
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
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            Không có kỳ thi đã tham gia nào được tìm thấy.
          </p>
        )}
      </div>

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
