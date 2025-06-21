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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const data = await prisma.bangDiem.findUnique({
      where: { id },
      include: { user: true, monHoc: true },
    });
    if (!data)
      return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();
  const parsed = BangDiemSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const updated = await prisma.bangDiem.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const deleted = await prisma.bangDiem.delete({ where: { id } });
    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
