import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UserLichHocSchema = z.object({
  userId: z.number(),
  lichHocId: z.number(),
});

// Tách ID tổ hợp dạng userId_lichHocId từ URL
function parseCompositeId(id: string) {
  const [userIdStr, lichHocIdStr] = id.split("_");
  const userId = Number(userIdStr);
  const lichHocId = Number(lichHocIdStr);
  if (isNaN(userId) || isNaN(lichHocId)) return null;
  return { userId, lichHocId };
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
    const record = await prisma.user_LichHoc.findUnique({
      where: {
        userId_lichHocId: ids,
      },
      include: {
        user: true,
        lichHoc: true,
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
  const parsed = UserLichHocSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  try {
    const updated = await prisma.user_LichHoc.update({
      where: {
        userId_lichHocId: ids,
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
    const deleted = await prisma.user_LichHoc.delete({
      where: {
        userId_lichHocId: ids,
      },
    });

    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
