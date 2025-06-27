import {
  CalendarDays,
  BarChart2,
  PieChart,
  BookOpen,
  FileText,
  StickyNote,
  Pencil,
  Hourglass,
  History,
  AlarmClock,
  ListOrdered,
  FileSearch,
  AlarmPlus,
  CalendarCheck2,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

type SidebarMenuItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: SidebarMenuItem[];
};

export const menuItems: SidebarMenuItem[] = [
  {
    title: "Lịch học",
    icon: CalendarDays,
    href: "/components/calender",
    children: [
      {
        title: "Xem lịch học",
        icon: CalendarCheck2,
        href: "/calender/schedulePage",
      },
      {
        title: "Đăng ký lịch học",
        icon: AlarmPlus,
        href: "/calender/register",
      },
    ],
  },
  {
    title: "Tiến độ học tập",
    icon: BarChart2,
    href: "/dashboard/tiendo",
    children: [
      {
        title: "Xem tiến độ",
        icon: TrendingUp,
        href: "/app/monhoc/danhsach",
      },
      {
        title: "Bảng điểm",
        icon: ClipboardList,
        href: "/dashboard/tiendo/bangdiem",
      },
    ],
  },
  {
    title: "Thống kê học tập",
    icon: PieChart,
    href: "/dashboard/thongke",
    children: [
      {
        title: "Đồng hồ",
        icon: ListOrdered,
        href: "/thongKe/dongHo",
      },
      {
        title: "Thống kê",
        icon: ListOrdered,
        href: "/thongKe/thongKe",
      },
    ],
  },
  {
    title: "Môn học",
    icon: BookOpen,
    href: "/dashboard/monhoc",
    children: [
      {
        title: "Danh sách môn",
        icon: ListOrdered,
        href: "/monhoc/danhsach",
      },
      {
        title: "Tài liệu học",
        icon: FileSearch,
        href: "/monhoc/tailieu",
      },
    ],
  },
  {
    title: "Ghi chú",
    icon: StickyNote,
    href: "/dashboard/ghichu",
    children: [
      {
        title: "Ghi chú",
        icon: Pencil,
        href: "/ghiChu/ghiChu",
      },
      {
        title: "Quan trọng",
        icon: FileText,
        href: "/ghiChu/quanTrong",
      },
    ],
  },
  {
    title: "Kỳ thi sắp tới",
    icon: Hourglass,
    href: "/dashboard/kythi",
    children: [
      {
        title: "Lịch thi",
        icon: CalendarCheck2,
        href: "/lichThi/lichThi",
      },
      {
        title: "Lịch sử thi",
        icon: History,
        href: "/lichThi/lichSuThi",
      },
    ],
  },
  {
    title: "Nhắc nhở học tập",
    icon: AlarmClock,
    href: "/dashboard/nhacnho",
    children: [
      {
        title: "Tạo nhắc nhở",
        icon: AlarmPlus,
        href: "/dashboard/nhacnho/tao",
      },
      {
        title: "Danh sách nhắc nhở",
        icon: ListOrdered,
        href: "/dashboard/nhacnho/danhsach",
      },
    ],
  },
];
