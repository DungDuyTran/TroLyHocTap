// app/api/kyThi/route.ts
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const KyThiSchema = z.object({
  tenKyThi: z.string().min(1, "Tên kỳ thi không được để trống."),
  ghiChu: z.string().min(1, "Ghi chú không được để trống.").optional(),
  thoiGianThi: z.string().min(1, "Thời gian thi không được để trống."),
  daThamGia: z.boolean().default(false).optional(),
});

// Sửa đổi UpdateKyThiSchema để tất cả các trường đều là optional một cách rõ ràng
// Đảm bảo rằng khi chỉ cập nhật daThamGia, các trường khác không bị yêu cầu.
const UpdateKyThiSchema = z.object({
  tenKyThi: z.string().min(1, "Tên kỳ thi không được để trống.").optional(),
  ghiChu: z.string().min(1, "Ghi chú không được để trống.").optional(),
  thoiGianThi: z.string().datetime("Thời gian thi không hợp lệ.").optional(),
  daThamGia: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const monHocIdParam = searchParams.get("monHocId");
  const daThamGiaParam = searchParams.get("daThamGia");
  const tenKyThiSearch = searchParams.get("tenKyThi");

  const where: any = {};

  if (tenKyThiSearch) {
    where.tenKyThi = {
      contains: tenKyThiSearch,
      mode: "insensitive",
    };
  }

  if (monHocIdParam && monHocIdParam !== "all") {
    where.kyThiMonHoc = {
      some: {
        monHocId: parseInt(monHocIdParam),
      },
    };
  }

  if (daThamGiaParam !== null) {
    where.daThamGia = daThamGiaParam === "true";
  }

  try {
    const data = await prisma.kyThi.findMany({
      where,
      include: {
        kyThiMonHoc: {
          include: {
            monHoc: true,
          },
        },
      },
      orderBy: { thoiGianThi: "asc" },
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi tải danh sách kỳ thi:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payloads = Array.isArray(body) ? body : [body];

    const newKyThiRecords = [];
    for (const item of payloads) {
      const parsed = KyThiSchema.safeParse(item);
      if (!parsed.success) {
        console.error("Lỗi xác thực POST:", parsed.error.format());
        return NextResponse.json(
          { error: parsed.error.format() },
          { status: 400 }
        );
      }
      const { thoiGianThi, ...rest } = parsed.data;
      newKyThiRecords.push({
        ...rest,
        thoiGianThi: new Date(thoiGianThi),
      });
    }

    const created = await prisma.$transaction(
      newKyThiRecords.map((data) => prisma.kyThi.create({ data }))
    );

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    console.error("Lỗi khi tạo kỳ thi:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Đảm bảo await params ở đây để tránh lỗi "params should be awaited"
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID kỳ thi không hợp lệ." },
        { status: 400 }
      );
    }

    const body = await req.json();
    // Sử dụng UpdateKyThiSchema đã được chỉnh sửa
    const parsed = UpdateKyThiSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Lỗi xác thực PUT:", parsed.error.format());
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { thoiGianThi, ...rest } = parsed.data;

    const updateData: any = { ...rest };
    if (thoiGianThi) {
      updateData.thoiGianThi = new Date(thoiGianThi);
    }

    const updatedKyThi = await prisma.kyThi.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(updatedKyThi, { status: 200 });
  } catch (error: any) {
    console.error("Lỗi khi cập nhật kỳ thi:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Đảm bảo await params ở đây để tránh lỗi "params should be awaited"
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID kỳ thi không hợp lệ." },
        { status: 400 }
      );
    }

    await prisma.kyThi.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Kỳ thi đã được xóa thành công." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Lỗi khi xóa kỳ thi:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
