// Tạo file mới: app/api/ghiChu/[id]/route.ts hoặc pages/api/ghiChu/[id].ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const GhiChuUpdateSchema = z.object({
  noiDung: z.string().min(1).optional(),
  ngayTao: z.string().datetime().optional(),
  userId: z.number().int().positive().optional(),
  isQuanTrong: z.boolean().optional(), // THÊM DÒNG NÀY
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const body = await req.json();
    const validated = GhiChuUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.format() },
        { status: 400 }
      );
    }

    const updatedGhiChu = await prisma.ghiChu.update({
      where: { id: id },
      data: validated.data,
    });
    return NextResponse.json(updatedGhiChu, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật ghi chú:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Giữ lại hoặc thêm các method khác như GET, DELETE cho [id] nếu cần
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const ghiChu = await prisma.ghiChu.findUnique({
      where: { id: id },
    });
    if (!ghiChu) {
      return NextResponse.json(
        { error: "Ghi chú không tìm thấy" },
        { status: 404 }
      );
    }
    return NextResponse.json(ghiChu, { status: 200 });
  } catch (error) {
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
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    await prisma.ghiChu.delete({
      where: { id: id },
    });
    return NextResponse.json(
      { message: "Ghi chú đã được xóa thành công." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xóa ghi chú:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
