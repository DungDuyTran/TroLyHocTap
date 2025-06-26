// Ví dụ: app/api/taiLieu/route.ts (hoặc pages/api/taiLieu.ts)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client"; // Đảm bảo đường dẫn đúng

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const monHocIdParam = searchParams.get("monHocId");
  const filters: any = {};

  if (monHocIdParam) {
    // Chuyển đổi ID từ chuỗi sang số nguyên và thêm vào bộ lọc
    filters.monHocId = parseInt(monHocIdParam);
  }

  try {
    const data = await prisma.taiLieu.findMany({
      where: filters,
      include: { monHoc: true }, // Bao gồm thông tin môn học nếu bạn muốn trả về
      orderBy: { ngayTao: "desc" }, // Sắp xếp theo ngày tạo
      // Có thể thêm skip và take cho phân trang nếu cần
    });

    // Trả về dữ liệu trong một đối tượng có trường 'data'
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi tải tài liệu:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Bạn cũng cần đảm bảo các hàm POST, PUT, DELETE khác cho TaiLieu model của bạn hoạt động đúng cách
// Dưới đây là ví dụ cho POST, PUT, DELETE dựa trên schema mới của bạn:

import { z } from "zod";

const TaiLieuSchema = z.object({
  tenFile: z.string().min(1).max(45),
  huongDan: z.string().max(255),
  ghiChu: z.string().max(155),
  noiDung: z.string(),
  fileUrl: z.string().optional(), // Nếu fileUrl là tùy chọn
  monHocId: z.number().int().positive(),
});

const TaiLieuUpdateSchema = z.object({
  tenFile: z.string().min(1).max(45).optional(),
  huongDan: z.string().max(255).optional(),
  ghiChu: z.string().max(155).optional(),
  noiDung: z.string().optional(),
  fileUrl: z.string().optional(),
  monHocId: z.number().int().positive().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TaiLieuSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.format() },
        { status: 400 }
      );
    }

    const newTaiLieu = await prisma.taiLieu.create({
      data: {
        ...validated.data,
        ngayTao: new Date(), // Set ngayTao automatically on creation
      },
    });
    return NextResponse.json(newTaiLieu, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm tài liệu:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }
    const body = await req.json();
    const validated = TaiLieuUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.format() },
        { status: 400 }
      );
    }

    const updatedTaiLieu = await prisma.taiLieu.update({
      where: { id: id },
      data: validated.data,
    });
    return NextResponse.json(updatedTaiLieu, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật tài liệu:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }
    await prisma.taiLieu.delete({
      where: { id: id },
    });
    return NextResponse.json(
      { message: "Tài liệu đã được xóa thành công." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa tài liệu:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
