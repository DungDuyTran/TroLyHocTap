"use client";

import React from "react";
import {
  Lightbulb,
  Brain,
  TrendingUp,
  BookOpen,
  Clock,
  Users,
  Zap,
  CheckCircle,
  Cpu,
  Activity,
  Target,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center p-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fGVufDB8fHx8fA%3D%3D')",
          }}
        ></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 text-green-400 drop-shadow-lg animate-fade-in-down">
            Nâng Tầm Học Tập Cùng AI
          </h1>
          <p className="text-2xl text-gray-300 mb-8 animate-fade-in-up">
            Giải phóng tiềm năng học tập của bạn với ứng dụng trợ lý thông minh,
            tích hợp trí tuệ nhân tạo để tối ưu hóa mọi phiên học và đạt được
            thành công vượt trội.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-yellow-300 animate-slide-in-right">
            Tính Năng Nổi Bật Của Ứng Dụng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300 animate-fade-in">
              <Lightbulb size={56} className="text-green-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-green-300">
                Trợ Lý Học Tập AI
              </h3>
              <p className="text-gray-300 text-center">
                Trợ lý AI cá nhân hóa lộ trình học, gợi ý tài liệu và giải đáp
                thắc mắc 24/7, giúp bạn học hiệu quả hơn.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300 delay-100 animate-fade-in">
              <Brain size={56} className="text-blue-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-blue-300">
                Phân Tích Tiến Độ Thông Minh
              </h3>
              <p className="text-gray-300 text-center">
                Sử dụng AI để phân tích sâu sắc hiệu suất học tập, nhận diện
                điểm mạnh, điểm yếu và đưa ra khuyến nghị cải thiện.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300 delay-200 animate-fade-in">
              <TrendingUp size={56} className="text-red-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-red-300">
                Quản Lý Mục Tiêu
              </h3>
              <p className="text-gray-300 text-center">
                Đặt ra các mục tiêu học tập cụ thể, theo dõi tiến độ và nhận
                được sự hỗ trợ từ AI để đạt được chúng.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300 delay-300 animate-fade-in">
              <BookOpen size={56} className="text-yellow-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-yellow-300">
                Thư Viện Tài Liệu
              </h3>
              <p className="text-gray-300 text-center">
                Tổ chức và truy cập dễ dàng hàng ngàn tài liệu học tập, được gợi
                ý bởi AI dựa trên nhu cầu của bạn.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300 delay-400 animate-fade-in">
              <Clock size={56} className="text-green-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-green-300">
                Nhắc Nhở & Lịch Học
              </h3>
              <p className="text-gray-300 text-center">
                Hệ thống nhắc nhở thông minh đảm bảo bạn không bỏ lỡ buổi học,
                kỳ thi hay deadline quan trọng.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300 delay-500 animate-fade-in">
              <Users size={56} className="text-purple-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-purple-300">
                Cộng Đồng Học Tập
              </h3>
              <p className="text-gray-300 text-center">
                Kết nối với bạn bè, trao đổi kiến thức và cùng nhau vượt qua thử
                thách trong môi trường học tập sôi động.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Tools Section: Đồng Hồ Ghi Nhận Giờ Học & Đồ thị tiến độ */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-red-300 animate-slide-in-left">
            Công Cụ Cốt Lõi Cho Sự Thành Công
          </h2>
          <div className="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-12">
            <div className="lg:w-1/2">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-green-600 animate-fade-in-right">
                <Clock size={64} className="text-green-400 mb-6 mx-auto" />
                <h3 className="text-3xl font-bold mb-4 text-center text-yellow-300">
                  Đồng Hồ Ghi Nhận Giờ Học
                </h3>
                <p className="text-gray-300 text-lg text-center mb-6">
                  Ghi lại chính xác thời gian bạn dành cho mỗi môn học, mỗi
                  phiên học. Dữ liệu này là nền tảng để AI phân tích hiệu suất
                  và đưa ra lời khuyên tối ưu.
                </p>
                <ul className="text-gray-300 space-y-2 text-left px-4">
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-green-400 mr-2" />{" "}
                    Theo dõi thời gian thực tế
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-green-400 mr-2" />{" "}
                    Phân loại theo môn học
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-green-400 mr-2" />{" "}
                    Lưu trữ dữ liệu lâu dài
                  </li>
                </ul>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-blue-600 animate-fade-in-left">
                <TrendingUp size={64} className="text-blue-400 mb-6 mx-auto" />
                <h3 className="text-3xl font-bold mb-4 text-center text-yellow-300">
                  Đồ Thị Theo Dõi Tiến Độ
                </h3>
                <p className="text-gray-300 text-lg text-center mb-6">
                  Biểu đồ trực quan hóa tổng thời gian học theo ngày, tuần,
                  tháng, năm. Giúp bạn dễ dàng nhận thấy xu hướng học tập, duy
                  trì động lực và điều chỉnh kế hoạch.
                </p>
                <ul className="text-gray-300 space-y-2 text-left px-4">
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-blue-400 mr-2" />{" "}
                    Biểu đồ học tập chi tiết
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-blue-400 mr-2" />{" "}
                    Đánh giá hiệu suất theo thời gian
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={20} className="text-blue-400 mr-2" />{" "}
                    Nhận diện xu hướng cá nhân
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How AI Assists Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-green-400 animate-slide-in-right">
            AI Đồng Hành Cùng Bạn Học Tập
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-green-600 transform hover:scale-105 transition-transform duration-300 animate-fade-in">
              <Cpu size={56} className="text-green-400 mb-6 mx-auto" />{" "}
              {/* Đã thay Robot bằng Cpu */}
              <h3 className="text-2xl font-bold mb-4 text-center text-green-300">
                Gợi Ý Học Tập Cá Nhân Hóa
              </h3>
              <p className="text-gray-300 text-center">
                Dựa trên dữ liệu giờ học và tiến độ của bạn, AI sẽ đề xuất các
                chủ đề, tài liệu, và phương pháp học phù hợp nhất để tối ưu hóa
                hiệu suất.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-blue-600 transform hover:scale-105 transition-transform duration-300 delay-100 animate-fade-in">
              <Activity size={56} className="text-blue-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-blue-300">
                Phân Tích Hiệu Suất Học Tập
              </h3>
              <p className="text-gray-300 text-center">
                AI phân tích thời gian bạn dành cho từng môn học, mức độ tập
                trung, và kết quả kiểm tra để đưa ra cái nhìn tổng quan về hiệu
                suất của bạn.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-yellow-600 transform hover:scale-105 transition-transform duration-300 delay-200 animate-fade-in">
              <Target size={56} className="text-yellow-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-yellow-300">
                Tối Ưu Hóa Kế Hoạch Học
              </h3>
              <p className="text-gray-300 text-center">
                Trợ lý AI giúp bạn điều chỉnh lịch trình, phân bổ thời gian hợp
                lý hơn cho các môn học dựa trên hiệu suất và mục tiêu đã đặt ra.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-purple-600 transform hover:scale-105 transition-transform duration-300 delay-300 animate-fade-in">
              <Zap size={56} className="text-purple-400 mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-4 text-center text-purple-300">
                Giải Đáp Thắc Mắc Nhanh Chóng
              </h3>
              <p className="text-gray-300 text-center">
                AI được tích hợp để giải đáp nhanh chóng các câu hỏi, cung cấp
                định nghĩa, ví dụ và giải thích chi tiết, hỗ trợ bạn mọi lúc,
                mọi nơi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-blue-400 animate-slide-in-left">
            Chuyển Đổi Trải Nghiệm Học Tập Của Bạn
          </h2>
          <div className="flex flex-col lg:flex-row items-center space-y-12 lg:space-y-0 lg:space-x-12">
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="AI Study Benefits"
                className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 animate-fade-in-right"
              />
            </div>
            <div className="lg:w-1/2 space-y-6 animate-fade-in-left">
              <div className="flex items-start bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <CheckCircle
                  size={32}
                  className="text-green-400 mr-4 flex-shrink-0"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">
                    Tăng Cường Hiệu Suất Học Tập
                  </h3>
                  <p className="text-gray-300">
                    Với sự hỗ trợ của AI, bạn sẽ học tập thông minh hơn, không
                    chỉ chăm chỉ hơn, đạt được kết quả tốt nhất.
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <CheckCircle
                  size={32}
                  className="text-green-400 mr-4 flex-shrink-0"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">
                    Tiết Kiệm Thời Gian Quý Báu
                  </h3>
                  <p className="text-300">
                    AI tự động hóa các tác vụ quản lý và tìm kiếm, giúp bạn tập
                    trung hoàn toàn vào việc tiếp thu kiến thức.
                  </p>
                </div>
              </div>
              <div className="flex items-start bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
                <CheckCircle
                  size={32}
                  className="text-green-400 mr-4 flex-shrink-0"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-yellow-300">
                    Luôn Đi Trước Một Bước
                  </h3>
                  <p className="text-gray-300">
                    Cập nhật liên tục các phương pháp học tập tiên tiến và tài
                    liệu mới, giúp bạn luôn dẫn đầu trong hành trình tri thức.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-purple-800 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold mb-8 text-white animate-fade-in-down">
            Bạn Đã Sẵn Sàng Thay Đổi Cách Bạn Học?
          </h2>
          <p className="text-xl text-purple-200 mb-10 animate-fade-in-up">
            Tham gia cộng đồng học tập thông minh của chúng tôi ngay hôm nay và
            khám phá tiềm năng học tập không giới hạn!
          </p>
          <a
            href="/lichHoc"
            className="inline-block px-12 py-5 bg-yellow-400 text-gray-900 rounded-full shadow-2xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 text-2xl font-bold animate-pulse-once"
          >
            Đăng Ký Miễn Phí Ngay!
          </a>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceIn {
          0%,
          20%,
          40%,
          60%,
          80%,
          100% {
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          0% {
            opacity: 0;
            transform: scale3d(0.3, 0.3, 0.3);
          }
          20% {
            transform: scale3d(1.1, 1.1, 1.1);
          }
          40% {
            transform: scale3d(0.9, 0.9, 0.9);
          }
          60% {
            opacity: 1;
            transform: scale3d(1.03, 1.03, 1.03);
          }
          80% {
            transform: scale3d(0.97, 0.97, 0.97);
          }
          100% {
            opacity: 1;
            transform: scale3d(1, 1, 1);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulseOnce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounceIn 1s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-pulse-once {
          animation: pulseOnce 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
