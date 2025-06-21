import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const TienDoHocTapArraySchema = z.array(
  z.object({
    trangThai: z.string().min(1),
    ghiChu: z.string().nullable().optional(),
    tienDoPhanTram: z.number().int().min(0).max(100),
    ngayBatDau: z.union([z.string(), z.date()]),
    ngayKetThuc: z.union([z.string(), z.date()]).nullable(),
    userId: z.number().int().positive(),
  })
);

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.tienDoHocTap.findMany({
      include: {
        user: true,
      },
    });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TienDoHocTapArraySchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.format() },
        { status: 400 }
      );
    }
    const created = await prisma.tienDoHocTap.createMany({
      data: validated.data,
      skipDuplicates: true,
    });
    return NextResponse.json(
      { message: "Đã thêm tiến độ học tập thành công", count: created.count },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return NextResponse.json(
    {
      message:
        "PUT không được hỗ trợ trên nhiều bản ghi. Vui lòng cập nhật từng bản ghi cụ thể.",
    },
    { status: 405 }
  );
}

export async function DELETE(req: NextRequest) {
  try {
    const deleted = await prisma.tienDoHocTap.deleteMany();
    return NextResponse.json(
      { message: `Đã xóa toàn bộ (${deleted.count}) tiến độ học tập.` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
