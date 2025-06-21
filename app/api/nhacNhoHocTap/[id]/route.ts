import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const NhacNhoSchema = z.object({
  tieuDe: z.string().min(1),
  noiDung: z.string().min(1),
  thoiGianNhac: z.string().datetime(),
  trangThai: z.boolean(),
  userId: z.number().int().positive(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  try {
    const data = await prisma.nhacNhoHocTap.findUnique({ where: { id } });
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
  const parsed = NhacNhoSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const updated = await prisma.nhacNhoHocTap.update({
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
    const deleted = await prisma.nhacNhoHocTap.delete({ where: { id } });
    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
