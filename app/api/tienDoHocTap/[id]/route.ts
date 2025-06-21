import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

const TienDoHocTapSchema = z.object({
  trangThai: z.string().min(1),
  ghiChu: z.string().optional(),
  tienDoPhanTram: z.number().min(0).max(100),
  ngayBatDau: z.coerce.date(),
  ngayKetThuc: z.coerce.date().optional(),
  userId: z.number().int().positive(),
});

// GET by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await prisma.tienDoHocTap.findUnique({
      where: { id: Number(params.id) },
      include: { user: true },
    });

    if (!data) {
      return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PUT by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const result = TienDoHocTapSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.format() }, { status: 400 });
  }

  try {
    const updated = await prisma.tienDoHocTap.update({
      where: { id: Number(params.id) },
      data: result.data,
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.tienDoHocTap.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
