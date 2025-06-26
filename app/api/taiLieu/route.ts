import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Định nghĩa schema validate đầu vào
const TaiLieuSchema = z.object({
  tenFile: z.string().min(1),
  huongDan: z.string().min(1),
  ghiChu: z.string().optional(),
  ngayTao: z.coerce.date(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 10;
  const page = Number(searchParams.get("page")) || 1;
  const tenFile = searchParams.get("tenFile");

  try {
    const whereClause = tenFile
      ? {
          tenFile: {
            contains: tenFile,
            mode: "insensitive",
          },
        }
      : {};

    const totalRecords = await prisma.taiLieu.count({ where: whereClause });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.taiLieu.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { ngayTao: "desc" },
    });

    return NextResponse.json(
      { data, extraInfo: { totalRecords, totalPages, page, limit } },
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
      const result = TaiLieuSchema.safeParse(item);
      if (!result.success) throw result.error.format();
      return result.data;
    });

    const created = await prisma.taiLieu.createMany({ data: validated });

    return NextResponse.json({ created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await prisma.taiLieu.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả tài liệu." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
