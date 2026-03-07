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

    const completeProcessing = await client.video.update({
        where: {
            userId: id,
            source: body.filename
        },
        data: {
            processing:false
        }
    })
    if (completeProcessing) {
        return NextResponse.json({status: 200})
    }
    return NextResponse.json({status: 400})
  } catch (error) {
    console.log('Error', error)
  }
}
