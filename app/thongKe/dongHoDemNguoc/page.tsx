"use client";

import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RefreshCcw } from "lucide-react";

interface CountdownTimerProps {
  showNotification: (
    message: string,
    type: "success" | "error" | "info"
  ) => void;
}

export default function CountdownTimerComponent({
  showNotification = () => {},
}: CountdownTimerProps) {
  const [countdownTimeInput, setCountdownTimeInput] = useState<number>(25);
  const [currentCountdownRemaining, setCurrentCountdownRemaining] =
    useState<number>(25 * 60);
  const [countdownTimerRunning, setCountdownTimerRunning] =
    useState<boolean>(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
          showNotification("Hết giờ! Hoàn thành mục tiêu học tập! ", "success");
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
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-green-600 h-[350px] w-[750px] mt-8 ml-[200px]">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600">
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
  );
}
