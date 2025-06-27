import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createLichHocRecordSchema = z.object({
  startTime: z.string().datetime("Thời gian bắt đầu không hợp lệ (ISO 8601)."),
  userId: z.string().optional(),
  subject: z.string().optional(),
  note: z.string().optional(),
});

const updateLichHocRecordSchema = z.object({
  endTime: z
    .string()
    .datetime("Thời gian kết thúc không hợp lệ (ISO 8601).")
    .optional(),
  duration: z.number().int().optional(),
  subject: z.string().optional(),
  note: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  try {
    const records = await prisma.lichHocRecord.findMany({
      where: userId ? { userId: userId } : {},
      orderBy: {
        startTime: "desc",
      },
    });
    return NextResponse.json({ data: records }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi tải bản ghi lịch học:", error);
    return NextResponse.json(
      { error: "Không thể tải bản ghi lịch học." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createLichHocRecordSchema.safeParse(body);

    if (!parsed.success) {
      console.error(
        "Lỗi xác thực dữ liệu POST LichHocRecord:",
        parsed.error.format()
      );
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const newRecord = await prisma.lichHocRecord.create({
      data: {
        startTime: new Date(parsed.data.startTime),
        userId: parsed.data.userId,
        subject: parsed.data.subject,
        note: parsed.data.note,
      },
    });
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi khi tạo bản ghi lịch học mới:", error);
    return NextResponse.json(
      { error: "Không thể tạo bản ghi lịch học mới." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split("/").pop() || "");

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "ID bản ghi không hợp lệ." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const parsed = updateLichHocRecordSchema.safeParse(body);

    if (!parsed.success) {
      console.error(
        "Lỗi xác thực dữ liệu PUT LichHocRecord:",
        parsed.error.format()
      );
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const updatedRecord = await prisma.lichHocRecord.update({
      where: { id: id },
      data: {
        endTime: parsed.data.endTime
          ? new Date(parsed.data.endTime)
          : undefined,
        duration: parsed.data.duration,
        subject: parsed.data.subject,
        note: parsed.data.note,
      },
    });
    return NextResponse.json(updatedRecord, { status: 200 });
  } catch (error: any) {
    console.error(`Lỗi khi cập nhật bản ghi lịch học ID ${id}:`, error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Bản ghi lịch học không tìm thấy." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Không thể cập nhật bản ghi lịch học." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = parseInt(url.pathname.split("/").pop() || "");

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "ID bản ghi không hợp lệ." },
      { status: 400 }
    );
  }

  try {
    await prisma.lichHocRecord.delete({
      where: { id: id },
    });
    return NextResponse.json(
      { message: "Bản ghi lịch học đã được xóa." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(`Lỗi khi xóa bản ghi lịch học ID ${id}:`, error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Bản ghi lịch học không tìm thấy." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Không thể xóa bản ghi lịch học." },
      { status: 500 }
    );
  }
}
