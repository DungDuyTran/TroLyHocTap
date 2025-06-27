// app/api/kyThi_monHoc/route.ts
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const KyThiMonHocSchema = z.object({
  kyThiId: z.number().int().positive("ID Kỳ thi phải là số nguyên dương."),
  monHocId: z.number().int().positive("ID Môn học phải là số nguyên dương."),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const kyThiId = searchParams.get("kyThiId");
  const monHocId = searchParams.get("monHocId");

  const where: any = {};
  if (kyThiId) {
    where.kyThiId = parseInt(kyThiId);
  }
  if (monHocId) {
    where.monHocId = parseInt(monHocId);
  }

  try {
    const data = await prisma.kyThi_MonHoc.findMany({
      where,
      include: {
        kyThi: true,
        monHoc: true,
      },
    });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    // Added : any to explicitly type error
    console.error("Lỗi khi tải quan hệ KyThi_MonHoc:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = KyThiMonHocSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Lỗi xác thực POST KyThi_MonHoc:", parsed.error.format());
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const newKyThiMonHoc = await prisma.kyThi_MonHoc.create({
      data: parsed.data,
    });
    return NextResponse.json(newKyThiMonHoc, { status: 201 });
  } catch (error: any) {
    // Added : any
    console.error("Lỗi khi tạo quan hệ KyThi_MonHoc:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Quan hệ này đã tồn tại." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = KyThiMonHocSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Lỗi xác thực DELETE KyThi_MonHoc:", parsed.error.format());
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { kyThiId, monHocId } = parsed.data;

    await prisma.kyThi_MonHoc.delete({
      where: {
        kyThiId_monHocId: {
          kyThiId: kyThiId,
          monHocId: monHocId,
        },
      },
    });
    return NextResponse.json(
      { message: "Quan hệ KyThi_MonHoc đã được xóa." },
      { status: 200 }
    );
  } catch (error: any) {
    // Added : any
    console.error("Lỗi khi xóa quan hệ KyThi_MonHoc:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
