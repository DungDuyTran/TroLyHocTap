"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("⚠️ Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      router.push("/dangNhap"); // chuyển sang login sau khi đăng ký
    } catch (err: any) {
      console.error("Signup error:", err);
      let errorMessage = "❌ Đăng ký thất bại";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email đã tồn tại";
          break;
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ";
          break;
        case "auth/weak-password":
          errorMessage = "Mật khẩu phải có ít nhất 6 ký tự";
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-white">
      <img
        src="/dangky.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />

      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="bg-[rgb(202,177,101)] bg-opacity-60 p-10 rounded-lg w-[400px] opacity-95">
          <h1 className="text-4xl font-bold text-[rgb(255,255,255)] mb-8 text-center">
            Đăng ký
          </h1>

          {error && (
            <div className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded mb-4 text-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-4 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="p-4 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-[rgb(125,105,44)] hover:bg-[rgb(155,134,72)] text-white font-semibold py-3 rounded disabled:opacity-50"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          <p className="mt-8 text-black text-center text-sm">
            Đã có tài khoản?{" "}
            <a className="text-white hover:underline mr-3" href="/dangNhap">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
