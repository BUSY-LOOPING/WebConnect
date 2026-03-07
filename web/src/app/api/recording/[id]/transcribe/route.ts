import { client } from "@/lib/prisma";
import { Ewert } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  //WIP
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
      console.log("Storing in kb");
      return NextResponse.json({status: 200})
    }
  } catch (error) {
    console.log("Error", error);
  }
}
