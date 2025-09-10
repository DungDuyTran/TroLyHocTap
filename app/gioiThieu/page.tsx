"use client";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-inter">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden">
        {/* Background + overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Navigation buttons */}
        <div className="absolute top-6 right-12 flex gap-4 z-20">
          <button
            className="px-5 py-2 rounded-xl font-bold bg-white text-green-600 shadow font-mono transition hover:bg-green-800 hover:text-white"
            onClick={() => router.push("/dangnhap")}
          >
            Sign in
          </button>
          <button
            className="px-5 py-2 rounded-xl font-bold bg-white text-green-600 shadow font-mono transition hover:bg-green-800 hover:text-white"
            onClick={() => router.push("/dangky")}
          >
            Sign up
          </button>
        </div>

        {/* Hero text */}
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
            <FeatureCard
              icon={<Lightbulb size={56} className="text-green-400 mx-auto" />}
              title="Trợ Lý Học Tập AI"
              desc="Trợ lý AI cá nhân hóa lộ trình học, gợi ý tài liệu và giải đáp thắc mắc 24/7, giúp bạn học hiệu quả hơn."
              color="green-300"
            />
            <FeatureCard
              icon={<Brain size={56} className="text-blue-400 mx-auto" />}
              title="Phân Tích Tiến Độ Thông Minh"
              desc="AI phân tích hiệu suất học tập, nhận diện điểm mạnh, điểm yếu và đưa ra khuyến nghị cải thiện."
              color="blue-300"
            />
            <FeatureCard
              icon={<TrendingUp size={56} className="text-red-400 mx-auto" />}
              title="Quản Lý Mục Tiêu"
              desc="Đặt ra mục tiêu học tập cụ thể, theo dõi tiến độ và nhận được sự hỗ trợ từ AI."
              color="red-300"
            />
            <FeatureCard
              icon={<BookOpen size={56} className="text-yellow-400 mx-auto" />}
              title="Thư Viện Tài Liệu"
              desc="Tổ chức và truy cập hàng ngàn tài liệu học tập, được gợi ý bởi AI."
              color="yellow-300"
            />
            <FeatureCard
              icon={<Clock size={56} className="text-green-400 mx-auto" />}
              title="Nhắc Nhở & Lịch Học"
              desc="Hệ thống nhắc nhở thông minh đảm bảo bạn không bỏ lỡ buổi học hay kỳ thi."
              color="green-300"
            />
            <FeatureCard
              icon={<Users size={56} className="text-purple-400 mx-auto" />}
              title="Cộng Đồng Học Tập"
              desc="Kết nối với bạn bè, trao đổi kiến thức và cùng nhau học tập."
              color="purple-300"
            />
          </div>
        </div>
      </section>

      {/* Core Tools Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-5xl font-extrabold text-center mb-16 text-red-300 animate-slide-in-left">
            Công Cụ Cốt Lõi Cho Sự Thành Công
          </h2>
          <div className="flex flex-col lg:flex-row gap-12">
            <ToolCard
              icon={<Clock size={64} className="text-green-400 mx-auto" />}
              title="Đồng Hồ Ghi Nhận Giờ Học"
              desc="Ghi lại thời gian bạn dành cho mỗi môn học. AI phân tích hiệu suất và đưa ra lời khuyên."
              items={[
                "Theo dõi thời gian thực tế",
                "Phân loại theo môn học",
                "Lưu trữ dữ liệu lâu dài",
              ]}
              border="green-600"
            />
            <ToolCard
              icon={<TrendingUp size={64} className="text-blue-400 mx-auto" />}
              title="Đồ Thị Theo Dõi Tiến Độ"
              desc="Biểu đồ trực quan hóa tổng thời gian học theo ngày, tuần, tháng, năm."
              items={[
                "Biểu đồ học tập chi tiết",
                "Đánh giá hiệu suất theo thời gian",
                "Nhận diện xu hướng cá nhân",
              ]}
              border="blue-600"
            />
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
            <FeatureCard
              icon={<Cpu size={56} className="text-green-400 mx-auto" />}
              title="Gợi Ý Học Tập Cá Nhân Hóa"
              desc="AI đề xuất chủ đề, tài liệu, và phương pháp học phù hợp nhất để tối ưu hóa hiệu suất."
              color="green-300"
            />
            <FeatureCard
              icon={<Activity size={56} className="text-blue-400 mx-auto" />}
              title="Phân Tích Hiệu Suất Học Tập"
              desc="AI phân tích thời gian bạn học, mức độ tập trung, và kết quả kiểm tra."
              color="blue-300"
            />
            <FeatureCard
              icon={<Target size={56} className="text-yellow-400 mx-auto" />}
              title="Tối Ưu Hóa Kế Hoạch Học"
              desc="AI điều chỉnh lịch trình, phân bổ thời gian hợp lý cho các môn học."
              color="yellow-300"
            />
            <FeatureCard
              icon={<Zap size={56} className="text-purple-400 mx-auto" />}
              title="Giải Đáp Thắc Mắc Nhanh Chóng"
              desc="AI cung cấp định nghĩa, ví dụ và giải thích chi tiết mọi lúc, mọi nơi."
              color="purple-300"
            />
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
            Tham gia cộng đồng học tập thông minh ngay hôm nay và khám phá tiềm
            năng học tập không giới hạn!
          </p>
          <a
            href="/lichHoc"
            className="inline-block px-12 py-5 bg-yellow-400 text-gray-900 rounded-full shadow-2xl hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 text-2xl font-bold animate-pulse-once"
          >
            Đăng Ký Miễn Phí Ngay!
          </a>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="bg-gray-700 p-8 rounded-xl shadow-lg border border-gray-600 transform hover:scale-105 transition-transform duration-300 animate-fade-in">
      {icon}
      <h3 className={`text-2xl font-bold mb-4 text-center text-${color}`}>
        {title}
      </h3>
      <p className="text-gray-300 text-center">{desc}</p>
    </div>
  );
}

function ToolCard({
  icon,
  title,
  desc,
  items,
  border,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  items: string[];
  border: string;
}) {
  return (
    <div
      className={`bg-gray-800 p-8 rounded-xl shadow-lg border border-${border} animate-fade-in`}
    >
      {icon}
      <h3 className="text-3xl font-bold mb-4 text-center text-yellow-300">
        {title}
      </h3>
      <p className="text-gray-300 text-lg text-center mb-6">{desc}</p>
      <ul className="text-gray-300 space-y-2 text-left px-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <CheckCircle size={20} className="text-green-400 mr-2" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
