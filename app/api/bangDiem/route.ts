import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BangDiemSchema = z.object({
  diemGiuaKy: z.string(),
  diemThuongKy: z.string(),
  diemTrungBinh: z.string(),
  userId: z.number().int().positive(),
  monHocId: z.number().int().positive(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10;
  const page = Number(searchParams.get("page")) || 1;

  const filters: any = {
    ...(searchParams.get("userId") && {
      userId: Number(searchParams.get("userId")),
    }),
    ...(searchParams.get("monHocId") && {
      monHocId: Number(searchParams.get("monHocId")),
    }),
  };

  try {
    const totalRecords = await prisma.bangDiem.count({ where: filters });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.bangDiem.findMany({
      where: filters,
      include: { user: true, monHoc: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(
      {
        data,
        extraInfo: { totalRecords, totalPages, page, limit },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records = Array.isArray(body) ? body : [body];

    const validated = records.map((item) => {
      const parsed = BangDiemSchema.safeParse(item);
      if (!parsed.success) throw parsed.error.format();
      return parsed.data;
    });

    const result = await prisma.bangDiem.createMany({ data: validated });

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await prisma.bangDiem.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả bảng điểm." });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
