// app/api/lichHocRecord/[id]/route.ts
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const LichHocRecordUpdateSchema = z.object({
  endTime: z.string().datetime().optional(),
  duration: z.number().int().optional(),
  subject: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recordId = parseInt(params.id);
    if (isNaN(recordId)) {
      return NextResponse.json(
        { error: "ID bản ghi không hợp lệ." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsed = LichHocRecordUpdateSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Lỗi xác thực PUT LichHocRecord:", parsed.error.format());
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const updatedRecord = await prisma.lichHocRecord.update({
      where: { id: recordId },
      data: parsed.data,
    });

    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật bản ghi lịch học:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Bản ghi không tồn tại để cập nhật." },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recordId = parseInt(params.id);
    if (isNaN(recordId)) {
      return NextResponse.json(
        { error: "ID bản ghi không hợp lệ." },
        { status: 400 }
      );
    }

    const record = await prisma.lichHocRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Bản ghi không tìm thấy." },
        { status: 404 }
      );
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi lấy bản ghi lịch học theo ID:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recordId = parseInt(params.id);
    if (isNaN(recordId)) {
      return NextResponse.json(
        { error: "ID bản ghi không hợp lệ." },
        { status: 400 }
      );
    }

    await prisma.lichHocRecord.delete({
      where: { id: recordId },
    });

    return NextResponse.json(
      { message: "Bản ghi đã được xóa." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi xóa bản ghi lịch học:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Bản ghi không tồn tại để xóa." },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
