import { client } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const targetWorkspaceId = body.workspaceId || await getPersonalWorkspaceId(id);
    if (!targetWorkspaceId) return NextResponse.json({ status: 400 });

    const videoData: any = {
      source: body.filename,
      userId: id,
    };

    if (body.folderId) {
      videoData.folderId = body.folderId;
    }

    const startProcessingVideo = await client.workSpace.update({
      where: { id: targetWorkspaceId },
      data: {
        videos: { create: videoData },
      },
      select: {
        User: {
          select: {
            subscription: { select: { plan: true } },
          },
        },
      },
    });

    if (startProcessingVideo) {
      return NextResponse.json({
        status: 200,
        plan: startProcessingVideo.User?.subscription?.plan,
      });
    }
    return NextResponse.json({ status: 400 });
  } catch (error) {
    console.log("Error", error);
    return NextResponse.json({ status: 500 });
  }
}

const getPersonalWorkspaceId = async (userId: string) => {
  const user = await client.user.findUnique({
    where: { id: userId },
    select: {
      workspace: {
        where: { type: "PERSONAL" },
        select: { id: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return user?.workspace[0]?.id ?? null;
};