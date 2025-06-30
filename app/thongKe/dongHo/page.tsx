"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, Play, Pause, StopCircle } from "lucide-react";

interface LichHocRecord {
  id: number;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  userId?: string | null;
  subject?: string | null;
  note?: string | null;
}

interface StudyStopwatchProps {
  onSessionComplete: () => void;
  showNotification: (
    message: string,
    type: "success" | "error" | "info"
  ) => void;
  loading: boolean;
}

export default function StudyStopwatchComponent({
  onSessionComplete = () => {},
  showNotification = () => {},
  loading,
}: StudyStopwatchProps) {
  const [studyTimerRunning, setStudyTimerRunning] = useState<boolean>(false);
  const [elapsedStudyTime, setElapsedStudyTime] = useState<number>(0);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  const studyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentElapsedRef = useRef(elapsedStudyTime);
  const currentSessionIdRef = useRef(currentSessionId);
  const studyTimerRunningRef = useRef(studyTimerRunning);

  useEffect(() => {
    currentElapsedRef.current = elapsedStudyTime;
  }, [elapsedStudyTime]);

  useEffect(() => {
    currentSessionIdRef.current = currentSessionId;
  }, [currentSessionId]);

  useEffect(() => {
    studyTimerRunningRef.current = studyTimerRunning;
  }, [studyTimerRunning]);

  const LICHHOC_API_URL = "http://localhost:3000/api/lichHocRecord";
  const MOCK_USER_ID = "user123";

  const createNewSessionRecord = async () => {
    try {
      const newSessionStartTime = new Date().toISOString();
      const response = await fetch(LICHHOC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startTime: newSessionStartTime,
          userId: MOCK_USER_ID,
          subject: undefined,
          note: undefined,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newRecord: LichHocRecord = await response.json();
      return newRecord;
    } catch (error: any) {
      console.error("Lỗi khi tạo phiên học mới:", error);
      showNotification(`Lỗi: ${(error as Error).message}`, "error");
      return null;
    }
  };

  const updateSessionRecord = async (
    id: number,
    updateData: {
      endTime?: string;
      duration?: number;
      subject?: string;
      note?: string;
    }
  ) => {
    try {
      const response = await fetch(`${LICHHOC_API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error: any) {
      console.error("Lỗi khi cập nhật phiên học:", error);
      showNotification(`Lỗi: ${(error as Error).message}`, "error");
      return false;
    }
  };

  const handleStartOrResumeStudySession = async () => {
    if (studyTimerRunningRef.current) return;

    const storedPausedSession = localStorage.getItem("pausedStudySession");
    if (storedPausedSession) {
      try {
        const sessionData = JSON.parse(storedPausedSession);
        const { id, startTime, pausedTime } = sessionData;

        const response = await fetch(`${LICHHOC_API_URL}/${id}`);
        if (response.ok) {
          const existingRecord: LichHocRecord = await response.json();
          if (existingRecord && !existingRecord.endTime) {
            setCurrentSessionId(id);
            setElapsedStudyTime(pausedTime);
            setStudyTimerRunning(true);
            showNotification("Đã tiếp tục phiên học!", "success");
            localStorage.removeItem("pausedStudySession");
            localStorage.setItem(
              "activeStudySession",
              JSON.stringify({ id, startTime })
            );
            return;
          }
        }
        localStorage.removeItem("pausedStudySession");
        showNotification(
          "Phiên học tạm dừng không hợp lệ hoặc đã kết thúc, bắt đầu phiên mới.",
          "info"
        );
      } catch (error: any) {
        console.error("Lỗi khi khôi phục phiên tạm dừng:", error);
        localStorage.removeItem("pausedStudySession");
        showNotification(
          `Lỗi khôi phục phiên tạm dừng: ${
            (error as Error).message
          }. Bắt đầu phiên mới.`,
          "error"
        );
      }
    }

    const storedActiveSession = localStorage.getItem("activeStudySession");
    if (storedActiveSession) {
      try {
        const sessionData = JSON.parse(storedActiveSession);
        const { id, startTime } = sessionData;

        const response = await fetch(`${LICHHOC_API_URL}/${id}`);
        if (response.ok) {
          const existingRecord: LichHocRecord = await response.json();
          if (existingRecord && !existingRecord.endTime) {
            setCurrentSessionId(id);
            setElapsedStudyTime(
              Math.floor((Date.now() - new Date(startTime).getTime()) / 1000)
            );
            setStudyTimerRunning(true);
            showNotification("Đã tiếp tục phiên học trước đó!", "success");
            return;
          }
        }
        localStorage.removeItem("activeStudySession");
        showNotification(
          "Phiên học trước đó không hợp lệ hoặc đã kết thúc, bắt đầu phiên mới.",
          "info"
        );
      } catch (error: any) {
        console.error("Lỗi khi khôi phục phiên đang chạy:", error);
        localStorage.removeItem("activeStudySession");
        showNotification(
          `Lỗi khôi phục phiên đang chạy: ${
            (error as Error).message
          }. Bắt đầu phiên mới.`,
          "error"
        );
      }
    }

    const newRecord = await createNewSessionRecord();
    if (newRecord) {
      setCurrentSessionId(newRecord.id);
      setElapsedStudyTime(0);
      setStudyTimerRunning(true);
      localStorage.setItem(
        "activeStudySession",
        JSON.stringify({ id: newRecord.id, startTime: newRecord.startTime })
      );
    }
  };

  const handlePauseStudySession = async () => {
    if (!studyTimerRunningRef.current || currentSessionIdRef.current === null) {
      return;
    }

    setStudyTimerRunning(false);
    if (studyIntervalRef.current) {
      clearInterval(studyIntervalRef.current);
      studyIntervalRef.current = null;
    }

    localStorage.setItem(
      "pausedStudySession",
      JSON.stringify({
        id: currentSessionIdRef.current,
        startTime: new Date(
          Date.now() - currentElapsedRef.current * 1000
        ).toISOString(),
        pausedTime: currentElapsedRef.current,
      })
    );
    localStorage.removeItem("activeStudySession");

    showNotification("Phiên học đã được tạm dừng.", "info");
    onSessionComplete();
  };

  const handleEndStudySession = async () => {
    if (currentSessionIdRef.current === null) {
      setStudyTimerRunning(false);
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
        studyIntervalRef.current = null;
      }
      localStorage.removeItem("activeStudySession");
      localStorage.removeItem("pausedStudySession");
      setCurrentSessionId(null);
      setElapsedStudyTime(0);
      showNotification(
        "Không có phiên học nào đang chạy hoặc tạm dừng để kết thúc.",
        "info"
      );
      onSessionComplete();
      return;
    }

    setStudyTimerRunning(false);
    if (studyIntervalRef.current) {
      clearInterval(studyIntervalRef.current);
      studyIntervalRef.current = null;
    }

    const success = await updateSessionRecord(currentSessionIdRef.current, {
      endTime: new Date().toISOString(),
      duration: currentElapsedRef.current,
      subject: undefined,
      note: undefined,
    });

    if (success) {
      showNotification("Kết thúc phiên học!", "success");
      setCurrentSessionId(null);
      setElapsedStudyTime(0);
      localStorage.removeItem("activeStudySession");
      localStorage.removeItem("pausedStudySession");
      onSessionComplete();
    } else {
      showNotification("Không thể kết thúc phiên học.", "error");
    }
  };

  useEffect(() => {
    if (studyTimerRunning) {
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
      }
      studyIntervalRef.current = setInterval(() => {
        setElapsedStudyTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
        studyIntervalRef.current = null;
      }
    }

    return () => {
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
        studyIntervalRef.current = null;
      }
    };
  }, [studyTimerRunning]);

  useEffect(() => {
    handleStartOrResumeStudySession();

    const handleBeforeUnload = async () => {
      if (
        studyTimerRunningRef.current &&
        currentSessionIdRef.current !== null
      ) {
        const endTime = new Date().toISOString();
        const duration = currentElapsedRef.current;
        try {
          await fetch(`${LICHHOC_API_URL}/${currentSessionIdRef.current}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endTime: endTime,
              duration: duration,
              subject: undefined,
              note: undefined,
            }),
            keepalive: true,
          });
          localStorage.removeItem("activeStudySession");
          localStorage.removeItem("pausedStudySession");
        } catch (error) {
          console.error("Lỗi khi lưu dữ liệu khi tắt trang:", error);
        }
      } else if (
        currentSessionIdRef.current !== null &&
        !studyTimerRunningRef.current
      ) {
        const sessionToSave = {
          id: currentSessionIdRef.current,
          startTime: new Date(
            Date.now() - currentElapsedRef.current * 1000
          ).toISOString(),
          pausedTime: currentElapsedRef.current,
        };
        localStorage.setItem(
          "pausedStudySession",
          JSON.stringify(sessionToSave)
        );
        localStorage.removeItem("activeStudySession");
      } else {
        localStorage.removeItem("activeStudySession");
        localStorage.removeItem("pausedStudySession");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
        studyIntervalRef.current = null;
      }
      if (
        studyTimerRunningRef.current &&
        currentSessionIdRef.current !== null
      ) {
        const sessionToSave = {
          id: currentSessionIdRef.current,
          startTime: new Date(
            Date.now() - currentElapsedRef.current * 1000
          ).toISOString(),
          pausedTime: currentElapsedRef.current,
        };
        localStorage.setItem(
          "pausedStudySession",
          JSON.stringify(sessionToSave)
        );
        localStorage.removeItem("activeStudySession");
      } else {
        localStorage.removeItem("activeStudySession");
        localStorage.removeItem("pausedStudySession");
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map((v) => (v < 10 ? "0" + v : v)).join(":");
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-600 h-[350px] w-[750px] mt-8 ml-[200px]">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
        Đồng Hồ Ghi Nhận Giờ Học
      </h2>
      <p className="text-sm text-gray-400 text-center mb-4">
        Ghi lại thời gian học tập thực tế của bạn một cách đơn giản.
      </p>
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Clock size={48} className="text-green-400" />
        <span className="text-5xl font-mono tracking-wider text-green-400">
          {formatTime(elapsedStudyTime)}
        </span>
      </div>
      <div className="flex justify-center space-x-4">
        {!studyTimerRunning && currentSessionId === null ? (
          <button
            onClick={handleStartOrResumeStudySession}
            className="px-6 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
            disabled={loading}
          >
            <Play size={24} />
            <span>Bắt đầu</span>
          </button>
        ) : studyTimerRunning ? (
          <>
            <button
              onClick={handlePauseStudySession}
              className="px-6 py-3 bg-orange-600 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
              disabled={loading}
            >
              <Pause size={24} />
              <span>Tạm dừng</span>
            </button>
            <button
              onClick={handleEndStudySession}
              className="px-6 py-3 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
              disabled={loading}
            >
              <StopCircle size={24} />
              <span>Kết thúc</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleStartOrResumeStudySession}
              className="px-6 py-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
              disabled={loading}
            >
              <Play size={24} />
              <span>Tiếp tục</span>
            </button>
            <button
              onClick={handleEndStudySession}
              className="px-6 py-3 bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-lg font-semibold flex items-center space-x-2"
              disabled={loading}
            >
              <StopCircle size={24} />
              <span>Kết thúc</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
