import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LichHocSchema = z.object({
  tieuDe: z.string().min(1),
  batDau: z.coerce.date(),
  ketThuc: z.coerce.date(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id))
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const body = await req.json();
  const parsed = LichHocSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  try {
    const updated = await prisma.lichHoc.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id))
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  try {
    const deleted = await prisma.lichHoc.delete({ where: { id } });
    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
