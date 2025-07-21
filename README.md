# 📚 Trợ Lý Học Tập – Study Assistant

Đồ án môn **Công nghệ phần mềm**, xây dựng bằng **Next.js + TypeScript**, hỗ trợ sinh viên quản lý lịch học, thời gian ôn tập, trao đổi với chatbot AI, và thống kê hiệu quả học tập.

---

## 🚀 Tính Năng Chính

- 📅 **Lịch học thông minh**

  - Hiển thị lịch bằng `React Big Calendar`, tương tác drag & drop
  - Thêm, sửa, xoá buổi học hoặc sự kiện cá nhân

- ⏱️ **Công cụ hỗ trợ học tập**

  - Đồng hồ đếm ngược (Pomodoro), đồng hồ đếm giờ học
  - Theo dõi thời gian học theo ngày

- 💬 **Tích hợp Chat AI**

  - Chatbot AI từ **Coze** – hỗ trợ giải thích kiến thức, trả lời nhanh
  - Tích hợp trực tiếp vào trang học

- 📊 **Thống kê – trực quan**

  - Vẽ biểu đồ học tập bằng `Recharts`
  - Phân tích thời lượng học theo chủ đề, tuần/tháng

- 🧩 **Quản lý dữ liệu học tập**
  - CRUD các mục: môn học, chủ đề, lịch học, giờ học
  - API đầy đủ: `GET`, `POST`, `PUT`, `DELETE`
  - Phân trang, lọc, tìm kiếm nội dung dễ dàng

---

## 🛠 Công Nghệ Sử Dụng

| Công Nghệ                 | Mục đích                          |
| ------------------------- | --------------------------------- |
| **Next.js 15**            | App Router + API routes           |
| **TypeScript**            | Giúp code rõ ràng, tránh lỗi      |
| **React 19**              | Giao diện linh hoạt               |
| **Tailwind CSS 4**        | Thiết kế nhanh bằng class utility |
| **Prisma ORM**            | Tương tác MySQL dễ dàng           |
| **MySQL**                 | Cơ sở dữ liệu chính               |
| **React Big Calendar**    | Hiển thị lịch học tương tác       |
| **React Hook Form + Zod** | Quản lý và kiểm tra form          |
| **Recharts**              | Vẽ biểu đồ học tập                |
| **Axios + SWR**           | Gọi và cache API hiệu quả         |
| **Coze SDK**              | Chatbot AI hỗ trợ học tập         |
| `date-fns`, `clsx`...     | Hỗ trợ xử lý thời gian và UI      |

---

## ⚙️ Cách Chạy Project

```bash
git clone https://github.com/DungDuyTran/TroLyHocTap
cd TroLyHocTap
npm install
npm run dev
```
