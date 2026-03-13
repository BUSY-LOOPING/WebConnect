"use server";

import { client } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { tr } from "date-fns/locale";
import { use } from "react";
import { sendEmail } from "./user";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const dbUser = await client.user.findUnique({
      where: { clerkid: user.id },
      select: { id: true },
    });
    if (!dbUser) return { status: 404 };

    const workspace = await client.workSpace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });
    if (!workspace) return { status: 404, data: { workspace: null } };

    const isOwner = workspace.userId === dbUser.id;
    const isMember = workspace.members.some((m) => m.userId === dbUser.id);

    if (!isOwner && !isMember) return { status: 401, data: { workspace: null } };

    // ✅ workspace is always returned here
    return { status: 200, data: { workspace } };
  } catch (error) {
    return { status: 400, data: { workspace: null } };
  }
};

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders };
    }
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 403, data: [] };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 404 };
    }
    const videos = await client.video.findMany({
      where: {
        OR: [
          { workSpaceId },
          { folderId: workSpaceId },
        ],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (videos) {
      return { status: 200, data: videos };
    }
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 500, data: [] };
  }
};

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { status: 404 };
    }

    const workspaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (workspaces) {
      return { status: 200, data: workspaces };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 404 };
  }
};

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 404 };
    }
    const authorized = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (authorized?.subscription?.plan === "PRO") {
      const workspace = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });
      if (workspace) {
        return { status: 201, data: "Workspace created" };
      }
    }
    return {
      status: 401,
      data: "You are not authorized to create a workspace.",
    };
  } catch (error) {
    return { status: 400 };
  }
};

export const renameFolders = async (folderId: string, name: string) => {
  try {
    const folder = await client.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name,
      },
    });
    if (folder) {
      return { status: 200, data: "Folder Renamed" };
    }
    return { status: 400, data: "Folder does not exist" };
  } catch (error) {
    return { status: 500, data: "Oops! something went wrong" };
  }
};

export const createFolder = async (workspaceId: string) => {
  try {
    const isNewFolder = await client.workSpace.update({
      where: {
        id: workspaceId,
      },
      data: {
        folders: {
          create: { name: "Untitled" },
        },
      },
    });
    if (isNewFolder) {
      return { status: 200, message: "New folder created" };
    }
  } catch (error) {
    return { status: 500, message: "Oops, something went wrong" };
  }
};

export const getFolderInfo = async (folderId: string) => {
  try {
    const folder = await client.folder.findUnique({
      where: {
        id: folderId,
      },
      select: {
        name: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (folder) {
      return {
        status: 200,
        data: folder,
      };
    }
    return {
      status: 400,
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      data: null,
    };
  }
};

export const moveVideoLocation = async (
  videoId: string,
  workspaceId: string,
  folderId: string,
) => {
  try {
    const location = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        folderId: folderId || null,
        workSpaceId: workspaceId,
      },
    });
    if (location) {
      return { status: 200, data: "Folder changed successfully" };
    }
    return { status: 404, data: "workspace/folder not found" };
  } catch (error) {
    return { status: 500, data: "Oops! something went wrong" };
  }
};

export const getPreviewVideo = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 400, message: 'You must be signed in' };
    }
    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        createdAt: true,
        source: true,
        description: true,
        processing: true,
        views: true,
        summary: true,
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
            clerkid: true,
            trial: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });
    if (video) {
      return {
        status: 200,
        data: video,
        author: user.id === video.User?.clerkid ? true : false,
      };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 500 };
  }
};

export const sendEmailForFirstView = async (videoId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const firstViewSettings = await client.user.findUnique({
      where: { clerkid: user.id },
      select: {
        firstView: true,
      },
    });

    if (!firstViewSettings?.firstView) return { status: 200 };

    const updatedVideo = await client.video.updateMany({
      where: {
        id: videoId,
        views: 0,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // If count is 0 → video already viewed before
    if (updatedVideo.count === 0) return { status: 200 };

    const video = await client.video.findUnique({
      where: {
        id: videoId,
      },
      select: {
        title: true,
        User: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!video?.User?.email) return { status: 404 };

    const { transporter, mailOptions } = await sendEmail(
      video.User.email,
      "You got a viewer",
      `Your video "${video.title}" just got its first viewer`
    );

    await transporter.sendMail(mailOptions);

    await client.user.update({
      where: { clerkid: user.id },
      data: {
        notification: {
          create: {
            content: mailOptions.text,
          },
        },
      },
    });

    return { status: 200 };
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
};
