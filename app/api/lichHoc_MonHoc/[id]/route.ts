import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LichHocMonHocSchema = z.object({
  lichHocId: z.number(),
  monHocId: z.number(),
});

function parseCompositeId(id: string) {
  const [lichHocIdStr, monHocIdStr] = id.split("_");
  const lichHocId = Number(lichHocIdStr);
  const monHocId = Number(monHocIdStr);
  if (isNaN(lichHocId) || isNaN(monHocId)) return null;
  return { lichHocId, monHocId };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ids = parseCompositeId(params.id);
  if (!ids)
    return NextResponse.json(
      { error: "Invalid composite ID" },
      { status: 400 }
    );

  try {
    const record = await prisma.lichHoc_MonHoc.findUnique({
      where: {
        lichHocId_monHocId: ids,
      },
      include: {
        lichHoc: true,
        monHoc: true,
      },
    });

    if (!record)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: record });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ids = parseCompositeId(params.id);
  if (!ids)
    return NextResponse.json(
      { error: "Invalid composite ID" },
      { status: 400 }
    );

  const body = await req.json();
  const parsed = LichHocMonHocSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const updated = await prisma.lichHoc_MonHoc.update({
      where: {
        lichHocId_monHocId: ids,
      },
      data: body,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const ids = parseCompositeId(params.id);
  if (!ids)
    return NextResponse.json(
      { error: "Invalid composite ID" },
      { status: 400 }
    );

  try {
    const deleted = await prisma.lichHoc_MonHoc.delete({
      where: {
        lichHocId_monHocId: ids,
      },
    });

    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
