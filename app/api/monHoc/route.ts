import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MonHocSchema = z.object({
  tenMon: z.string().min(1),
  giangVien: z.string().min(1),
  moTa: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const filters: any = {
    ...(searchParams.get("tenMon") && {
      tenMon: {
        contains: searchParams.get("tenMon") || "",
        mode: "insensitive",
      },
    }),
    ...(searchParams.get("giangVien") && {
      giangVien: {
        contains: searchParams.get("giangVien") || "",
        mode: "insensitive",
      },
    }),
  };

  try {
    const data = await prisma.monHoc.findMany({
      where: filters,
      orderBy: { tenMon: "asc" },
    });

    // ✅ Chỉ trả về mảng
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const records = Array.isArray(body) ? body : [body];

    const validated = records.map((item) => {
      const parsed = MonHocSchema.safeParse(item);
      if (!parsed.success) throw parsed.error.format();
      return parsed.data;
    });

    const result = await prisma.monHoc.createMany({ data: validated });

    return NextResponse.json({ result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE() {
  try {
    await prisma.monHoc.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả môn học." });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
