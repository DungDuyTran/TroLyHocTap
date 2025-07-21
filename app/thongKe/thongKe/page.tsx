"use client";

import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area, // Changed to AreaChart and Area
} from "recharts";
import {
  Book,
  Calendar,
  Loader2,
  TrendingUp,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

interface LichHocRecord {
  id: number;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  userId?: string | null;
  subject?: string | null;
  note?: string | null;
}

interface DailyStudySummary {
  date: string;
  totalDuration: number;
}

interface WeeklyStudySummary {
  week: string;
  totalDuration: number;
}

interface MonthlyStudySummary {
  month: string;
  totalDuration: number;
}

interface YearlyStudySummary {
  year: string;
  totalDuration: number;
}

export default function LichHocTrackerApp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [studyRecords, setStudyRecords] = useState<LichHocRecord[]>([]);

  const [dailySummary, setDailySummary] = useState<DailyStudySummary[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklyStudySummary[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlyStudySummary[]>(
    []
  );
  const [yearlySummary, setYearlySummary] = useState<YearlyStudySummary[]>([]);
  const [chartType, setChartType] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  const LICHHOC_API_URL = "http://localhost:3000/api/lichHocRecord";
  const MOCK_USER_ID = "user123";

  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const fetchStudyRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${LICHHOC_API_URL}?userId=${MOCK_USER_ID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const records: LichHocRecord[] = result.data;
      setStudyRecords(records);
      calculateSummaries(records);
      showNotification("Tải dữ liệu thành công!", "success");
    } catch (error: any) {
      console.error("Lỗi khi tải bản ghi lịch học:", error);
      showNotification(`Lỗi tải dữ liệu: ${(error as Error).message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyRecords();
  }, []);

  const calculateSummaries = (records: LichHocRecord[]) => {
    const dailyMap: { [key: string]: number } = {};
    const weeklyMap: { [key: string]: number } = {};
    const monthlyMap: { [key: string]: number } = {};
    const yearlyMap: { [key: string]: number } = {};

    records.forEach((record) => {
      if (record.startTime && record.endTime && record.duration !== null) {
        const startDate = new Date(record.startTime);
        const durationHours = record.duration / 3600;

        const dateKey = startDate.toISOString().split("T")[0];
        dailyMap[dateKey] = (dailyMap[dateKey] || 0) + durationHours;

        const startOfWeek = new Date(startDate);
        startOfWeek.setDate(
          startDate.getDate() - ((startDate.getDay() + 6) % 7)
        );
        const weekKey = `${startOfWeek.getFullYear()}-${(
          startOfWeek.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${startOfWeek
          .getDate()
          .toString()
          .padStart(2, "0")}`;
        weeklyMap[weekKey] = (weeklyMap[weekKey] || 0) + durationHours;

        const monthKey = startDate.toISOString().slice(0, 7);
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + durationHours;

        const yearKey = String(startDate.getFullYear());
        yearlyMap[yearKey] = (yearlyMap[yearKey] || 0) + durationHours;
      }
    });

    setDailySummary(
      Object.keys(dailyMap)
        .map((date) => ({
          date,
          totalDuration: parseFloat(dailyMap[date].toFixed(2)),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    );
    setWeeklySummary(
      Object.keys(weeklyMap)
        .map((week) => ({
          week,
          totalDuration: parseFloat(weeklyMap[week].toFixed(2)),
        }))
        .sort((a, b) => a.week.localeCompare(b.week))
    );
    setMonthlySummary(
      Object.keys(monthlyMap)
        .map((month) => ({
          month,
          totalDuration: parseFloat(monthlyMap[month].toFixed(2)),
        }))
        .sort((a, b) => a.month.localeCompare(b.month))
    );
    setYearlySummary(
      Object.keys(yearlyMap)
        .map((year) => ({
          year,
          totalDuration: parseFloat(yearlyMap[year].toFixed(2)),
        }))
        .sort((a, b) => a.year.localeCompare(b.year))
    );
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => (v < 10 ? "0" + v : v)).join(":");
  };

  const getChartData = () => {
    switch (chartType) {
      case "daily":
        return dailySummary;
      case "weekly":
        return weeklySummary;
      case "monthly":
        return monthlySummary;
      case "yearly":
        return yearlySummary;
      default:
        return [];
    }
  };

  const getXAxisKey = () => {
    switch (chartType) {
      case "daily":
        return "date";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      case "yearly":
        return "year";
      default:
        return "date";
    }
  };

  const getTotalDurationForPeriod = () => {
    let total = 0;
    const data = getChartData();
    data.forEach((item) => {
      total += item.totalDuration;
    });
    return parseFloat(total.toFixed(2));
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-green-600 drop-shadow-lg">
        📈 Thống Kê Học Tập
      </h1>

      {notification && (
        <div
          className={`fixed top-6 right-6 p-4 rounded-lg shadow-lg text-white flex items-center transition-all duration-300 transform z-50 ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-6 w-6 mr-2" />
          ) : notification.type === "error" ? (
            <XCircle className="h-6 w-6 mr-2" />
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-green-600 mt-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">
          Tổng Quan Học Tập
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-10 text-green-400">
            <Loader2 className="animate-spin mr-2" size={32} />
            Đang tải dữ liệu biểu đồ...
          </div>
        ) : (
          <>
            <div className="flex justify-center space-x-4 mb-6 flex-wrap">
              <button
                onClick={() => setChartType("daily")}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                  chartType === "daily"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setChartType("weekly")}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                  chartType === "weekly"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Tuần
              </button>
              <button
                onClick={() => setChartType("monthly")}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                  chartType === "monthly"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Tháng
              </button>
              <button
                onClick={() => setChartType("yearly")}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                  chartType === "yearly"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                Năm
              </button>
            </div>

            {getChartData().length > 0 ? (
              <>
                <div className="text-center text-xl font-bold mb-4 text-purple-300 flex items-center justify-center">
                  <TrendingUp size={24} className="mr-2" />
                  Tổng thời gian học trong giai đoạn:{" "}
                  <span className="text-yellow-300 ml-2">
                    {getTotalDurationForPeriod()} giờ
                  </span>
                </div>
                <div className="w-full h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart // Changed from BarChart
                      data={getChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                      <XAxis dataKey={getXAxisKey()} stroke="#cbd5e0" />
                      <YAxis
                        stroke="#cbd5e0"
                        label={{
                          value: "Thời gian học (giờ)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#cbd5e0",
                        }}
                      />
                      <Tooltip
                        formatter={(value: any) => [
                          `${value} giờ`,
                          "Thời gian học",
                        ]}
                        labelFormatter={(label: any) => {
                          if (chartType === "weekly") return `Tuần: ${label}`;
                          if (chartType === "monthly") return `Tháng: ${label}`;
                          if (chartType === "yearly") return `Năm: ${label}`;
                          return `Ngày: ${label}`;
                        }}
                        contentStyle={{
                          backgroundColor: "#2d3748",
                          borderColor: "#4a5568",
                          color: "#e2e8f0",
                        }}
                        labelStyle={{ color: "#a0aec0" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="totalDuration"
                        stroke="#8884d8"
                        fill="#8884d8"
                        name="Thời gian học"
                      />{" "}
                      {/* Changed from Bar to Area */}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center py-10">
                Không có dữ liệu để hiển thị biểu đồ{" "}
                {chartType === "daily"
                  ? "theo ngày"
                  : chartType === "weekly"
                  ? "theo tuần"
                  : chartType === "monthly"
                  ? "theo tháng"
                  : "theo năm"}
                .
              </p>
            )}
          </>
        )}

        <h3 className="text-2xl font-bold mb-4 text-orange-300 mt-8">
          Bản ghi chi tiết
        </h3>
        {studyRecords.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-96">
            {studyRecords.map((record) => (
              <div
                key={record.id}
                className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-300">
                    <Calendar size={16} className="inline-block mr-1" />
                    {new Date(record.startTime).toLocaleString("vi-VN")} -{" "}
                    {record.endTime
                      ? new Date(record.endTime).toLocaleString("vi-VN")
                      : "Đang học"}
                  </p>
                  {record.duration !== null && (
                    <p className="text-sm text-gray-400">
                      ⏰ Thời lượng: {formatTime(record.duration)}
                    </p>
                  )}
                  {record.note && (
                    <p className="text-sm text-gray-400">
                      📝 Ghi chú: {record.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">
            Không có bản ghi chi tiết nào.
          </p>
        )}
      </div>
    </div>
  );
}
