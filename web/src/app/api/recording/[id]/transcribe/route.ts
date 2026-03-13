import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await params;

    const content = JSON.parse(body.content);

    const transcribe = await client.video.update({
      where: {
        userId: id,
        source: body.filename,
      },
      data: {
        title: content.title,
        description: content.summary,
        summary: body.transcript,
      },
    });

    if (transcribe) {
      return NextResponse.json({ status: 200 });
    }
    return NextResponse.json({ status: 400 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({ status: 500 });
  }
}