"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Play,
  Pause,
  StopCircle,
  RefreshCcw,
  Book,
  Info,
  Timer,
  CheckCircle,
  XCircle,
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

interface MonHoc {
  id: number;
  tenMon: string;
}

interface StudyTimersProps {
  danhSachMonHoc: MonHoc[];
  onSessionComplete: () => void;
  showNotification: (message: string, type: "success" | "error") => void;
  loading: boolean;
}

export default function StudyTimersComponent({
  danhSachMonHoc,
  onSessionComplete,
  showNotification,
  loading,
}: StudyTimersProps) {
  const [studyTimerRunning, setStudyTimerRunning] = useState<boolean>(false);
  const [elapsedStudyTime, setElapsedStudyTime] = useState<number>(0);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  const [countdownTimeInput, setCountdownTimeInput] = useState<number>(25);
  const [currentCountdownRemaining, setCurrentCountdownRemaining] =
    useState<number>(25 * 60);
  const [countdownTimerRunning, setCountdownTimerRunning] =
    useState<boolean>(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [subject, setSubject] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const studyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const LICHHOC_API_URL = "http://localhost:3000/api/lichHoc";
  const MOCK_USER_ID = "user123";

  const startStudyTimer = async () => {
    if (studyTimerRunning) return;

    setStudyTimerRunning(true);
    setElapsedStudyTime(0);

    try {
      const response = await fetch(LICHHOC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: new Date().toISOString(),
          userId: MOCK_USER_ID,
          subject,
          note,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newRecord: LichHocRecord = await response.json();
      setCurrentSessionId(newRecord.id);
      showNotification("Bắt đầu phiên học mới!", "success");

      studyIntervalRef.current = setInterval(() => {
        setElapsedStudyTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error: any) {
      console.error("Lỗi khi bắt đầu phiên học:", error);
      showNotification(`Lỗi: ${error.message}`, "error");
      setStudyTimerRunning(false);
    }
  };

  const stopStudyTimer = async () => {
    if (!studyTimerRunning || currentSessionId === null) return;

    setStudyTimerRunning(false);
    if (studyIntervalRef.current) {
      clearInterval(studyIntervalRef.current);
      studyIntervalRef.current = null;
    }

    try {
      const endTime = new Date().toISOString();
      const duration = elapsedStudyTime;

      const response = await fetch(`${LICHHOC_API_URL}/${currentSessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endTime: endTime,
          duration: duration,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      showNotification("Kết thúc phiên học!", "success");
      setCurrentSessionId(null);
      setElapsedStudyTime(0);
      setSubject("");
      setNote("");
      onSessionComplete();
    } catch (error: any) {
      console.error("Lỗi khi kết thúc phiên học:", error);
      showNotification(`Lỗi: ${error.message}`, "error");
    }
  };

  const startCountdown = () => {
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);

    if (currentCountdownRemaining <= 0) {
      showNotification(
        "Thời gian đếm ngược đã hết. Vui lòng đặt lại.",
        "error"
      );
      return;
    }
    if (countdownTimerRunning) return;

    setCountdownTimerRunning(true);

    countdownIntervalRef.current = setInterval(() => {
      setCurrentCountdownRemaining((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current)
            clearInterval(countdownIntervalRef.current);
          setCountdownTimerRunning(false);
          showNotification("Hết giờ! Hoàn thành mục tiêu học tập!", "success");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
      setCountdownTimerRunning(false);
    }
  };

  const resetCountdown = () => {
    if (countdownIntervalRef.current)
      clearInterval(countdownIntervalRef.current);
    setCountdownTimerRunning(false);
    setCurrentCountdownRemaining(countdownTimeInput * 60);
  };

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => (v < 10 ? "0" + v : v)).join(":");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-5">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-600">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">
          Đồng Hồ Ghi Nhận Giờ Học
        </h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          Sử dụng đồng hồ này để ghi lại thời gian học tập thực tế của bạn.
        </p>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Clock size={48} className="text-green-400" />
          <span className="text-5xl font-mono tracking-wider text-green-400">
            {formatTime(elapsedStudyTime)}
          </span>
        </div>

        <div className="mb-4">
          <label
            htmlFor="subject"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            <Book size={16} className="inline-block mr-1" /> Môn học:
          </label>
          <select
            id="subject"
            className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={studyTimerRunning}
          >
            <option value="">Chọn môn học</option>
            {(danhSachMonHoc || []).map((mon) => (
              <option key={mon.id} value={mon.tenMon}>
                {mon.tenMon}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="note"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            <Info size={16} className="inline-block mr-1" /> Ghi chú:
          </label>
          <input
            type="text"
            id="note"
            className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ví dụ: Chương 1 - Đại số tuyến tính"
            disabled={studyTimerRunning}
          />
        </div>

        <div className="flex justify-center space-x-4">
          {!studyTimerRunning ? (
            <button
              onClick={startStudyTimer}
              className="px-6 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
              disabled={loading || !subject}
            >
              <Play size={24} />
              <span>Bắt đầu</span>
            </button>
          ) : (
            <button
              onClick={stopStudyTimer}
              className="px-6 py-3 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
              disabled={loading}
            >
              <StopCircle size={24} />
              <span>Dừng</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-600">
        <h2 className="text-3xl font-bold mb-6 text-center text-yellow-300">
          Đồng Hồ Đếm Ngược Mục Tiêu
        </h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          Thiết lập thời gian học tập mục tiêu và bắt đầu đếm ngược.
        </p>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Timer size={48} className="text-green-400" />
          <span className="text-5xl font-mono tracking-wider text-green-400">
            {formatTime(currentCountdownRemaining)}
          </span>
        </div>

        <div className="mb-6">
          <label
            htmlFor="countdownInput"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Thiết lập mục tiêu (phút):
          </label>
          <input
            type="number"
            id="countdownInput"
            className="shadow appearance-none border border-gray-600 rounded-md w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            value={countdownTimeInput}
            onChange={(e) => {
              const minutes = parseInt(e.target.value);
              setCountdownTimeInput(isNaN(minutes) ? 0 : minutes);
              setCurrentCountdownRemaining(isNaN(minutes) ? 0 : minutes * 60);
            }}
            min="0"
            placeholder="Nhập số phút mục tiêu"
            disabled={countdownTimerRunning}
          />
        </div>

        <div className="flex justify-center space-x-4">
          {!countdownTimerRunning &&
          currentCountdownRemaining === countdownTimeInput * 60 &&
          countdownTimeInput > 0 ? (
            <button
              onClick={startCountdown}
              className="px-6 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
            >
              <Play size={24} />
              <span>Bắt đầu</span>
            </button>
          ) : countdownTimerRunning ? (
            <button
              onClick={pauseCountdown}
              className="px-6 py-3 bg-orange-600 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
            >
              <Pause size={24} />
              <span>Tạm dừng</span>
            </button>
          ) : (
            <button
              onClick={startCountdown}
              className="px-6 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
              disabled={currentCountdownRemaining <= 0}
            >
              <Play size={24} />
              <span>
                {currentCountdownRemaining > 0 &&
                currentCountdownRemaining < countdownTimeInput * 60
                  ? "Tiếp tục"
                  : "Bắt đầu"}
              </span>
            </button>
          )}
          <button
            onClick={resetCountdown}
            className="px-6 py-3 bg-gray-600 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
          >
            <RefreshCcw size={24} />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>
    </div>
  );
}
