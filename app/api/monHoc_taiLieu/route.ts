import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validate POST
const MonHocTaiLieuSchema = z.object({
  monHocId: z.number(),
  taiLieuId: z.number(),
  noiDung: z.string(),
});

// Schema validate DELETE
const DeleteSchema = z.object({
  monHocId: z.number(),
  taiLieuId: z.number(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");

  const where = {
    ...(searchParams.get("monHocId") && {
      monHocId: Number(searchParams.get("monHocId")),
    }),
    ...(searchParams.get("taiLieuId") && {
      taiLieuId: Number(searchParams.get("taiLieuId")),
    }),
  };

  try {
    const totalRecords = await prisma.monHoc_TaiLieu.count({ where });
    const totalPages = Math.ceil(totalRecords / limit);

    const data = await prisma.monHoc_TaiLieu.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        monHoc: true,
        taiLieu: true,
      },
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
  const body = await req.json();
  const items = Array.isArray(body) ? body : [body];

  for (const item of items) {
    const parsed = MonHocTaiLieuSchema.safeParse(item);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
  }

  try {
    const created = await prisma.$transaction(
      items.map((item) =>
        prisma.monHoc_TaiLieu.create({
          data: item,
        })
      )
    );

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const items = Array.isArray(body) ? body : [body];

  for (const item of items) {
    const parsed = DeleteSchema.safeParse(item);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
  }

  try {
    const deleted = await prisma.$transaction(
      items.map(({ monHocId, taiLieuId }) =>
        prisma.monHoc_TaiLieu.delete({
          where: {
            monHocId_taiLieuId: {
              monHocId,
              taiLieuId,
            },
          },
        })
      )
    );

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 });
  }
}
