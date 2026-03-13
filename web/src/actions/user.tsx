"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET as string);
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    to,
    subject,
    text,
    html,
  };
  return { transporter, mailOptions };
};

export const onAuthenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 403 };
    }

    const userExist = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      include: {
        workspace: true,
        members: {
          include: {
            WorkSpace: true,
          },
        },
      },
    });
    if (userExist) {
      return { status: 200, user: userExist };
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstname: user.firstName,
        lastname: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspace: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (newUser) {
      return { status: 201, user: newUser };
    }
    return { status: 400 };
  } catch (error) {
    console.error("Full error:", error); // ← change this line
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 400 };
    }
    const notifications = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });
    if (notifications && notifications.notification.length > 0) {
      return { status: 200, data: notifications };
    }
    return { status: 400, data: [] };
  } catch (error) {
    return { status: 404, data: [] };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const users = await client.user.findMany({
      where: {
        OR: [
          { firstname: { contains: query } },
          { email: { contains: query } },
          { lastname: { contains: query } },
        ],
        NOT: [{ clerkid: user.id }],
      },
      select: {
        id: true,

        subscription: {
          select: {
            plan: true,
          },
        },
        firstname: true,
        lastname: true,
        email: true,
        image: true,
      },
    });

    if (users && users.length > 0) {
      return { status: 200, data: users };
    }

    return { status: 404, data: [] };
  } catch (error) {
    return { status: 400, data: [] };
  }
};

export const getPaymentInfo = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const payment = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    });
    if (payment) {
      return { status: 200, data: payment };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 500 };
  }
};

export const getFirstView = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const userData = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        firstView: true,
      },
    });
    if (userData) {
      return { status: 200, data: userData.firstView };
    }
    return { status: 400, data: false };
  } catch (error) {
    return { status: 400 };
  }
};

export const enableFirstView = async (state: boolean) => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };
    const view = await client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        firstView: state,
      },
    });

    if (view) {
      return {
        status: 200,
        data: "Setting updated",
      };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 500 };
  }
};

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined,
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      });
      if (reply) {
        return { status: 200, data: "Reply posted" };
      }
    } else {
      const newComment = await client.video.update({
        where: {
          id: videoId,
        },
        data: {
          comments: {
            create: {
              comment,
              userId,
            },
          },
        },
      });
      if (newComment) {
        return { status: 200, data: "New comment added" };
      }
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const profileAndImage = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    if (profileAndImage) return { status: 200, data: profileAndImage };
  } catch (error) {
    return { status: 400 };
  }
};

export const getUser = async () => {
  const user = await currentUser();
  if (!user) return { status: 404, data: null };

  const dbUser = await client.user.findUnique({
    where: { clerkid: user.id },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      image: true,
      trial: true,
      subscription: {
        select: { plan: true },
      },
    },
  });

  if (!dbUser) return { status: 404, data: null };
  return { status: 200, data: dbUser };
};

export const getVideoComments = async (id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        videoId: id,
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    });
    return { status: 200, data: comments };
  } catch (error) {
    return { status: 400 };
  }
};

export const inviteMembers = async (
  workspaceId: string,
  receiverId: string,
  email: string,
) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };
    const senderInfo = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    });
    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      });
      if (workspace) {
        const invitation = await client.invite.create({
          data: {
            senderId: senderInfo.id,
            receiverId,
            workSpaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
        });

        await client.user.update({
          where: {
            clerkid: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstname} into ${workspace.name}`,
              },
            },
          },
        });

        if (invitation) {
          const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>You're Invited to WebConnect</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="540" cellpadding="0" cellspacing="0" style="max-width:540px;width:100%;">

          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="color:#ffffff;font-size:17px;font-weight:600;letter-spacing:-0.2px;">WebConnect</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#161616;border-radius:14px;border:1px solid #2a2a2a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px 40px 36px;">

                    <!-- Heading -->
                    <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.4px;line-height:1.25;">
                      You've been invited
                    </h1>
                    <p style="margin:0 0 28px;color:#888888;font-size:14px;line-height:1.6;">
                      <span style="color:#cccccc;font-weight:500;">${senderInfo.firstname} ${senderInfo.lastname}</span>
                      &nbsp;invited you to join a workspace on WebConnect.
                    </p>

                    <!-- Info block -->
                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="background:#1e1e1e;border:1px solid #2a2a2a;border-radius:10px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:18px 22px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="vertical-align:middle;">
                                <div style="width:36px;height:36px;background:#ffffff;border-radius:8px;text-align:center;line-height:36px;display:inline-block;vertical-align:middle;">
                                  <span style="color:#0d0d0d;font-size:15px;font-weight:800;">${workspace.name.charAt(0).toUpperCase()}</span>
                                </div>
                                <span style="display:inline-block;vertical-align:middle;padding-left:12px;">
                                  <span style="display:block;color:#666666;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;margin-bottom:2px;">Workspace</span>
                                  <span style="display:block;color:#ffffff;font-size:14px;font-weight:600;">${workspace.name}</span>
                                </span>
                              </td>
                              <td align="right" style="vertical-align:middle;">
                                <span style="background:#252525;color:#666666;font-size:11px;padding:4px 10px;border-radius:20px;border:1px solid #333333;">
                                  Pending
                                </span>
                              </td>
                            </tr>
                          </table>

                          <div style="height:1px;background:#252525;margin:16px 0;"></div>

                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td>
                                <span style="display:block;color:#666666;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;margin-bottom:3px;">Invited by</span>
                                <span style="color:#aaaaaa;font-size:13px;">${senderInfo.firstname} ${senderInfo.lastname}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Single CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}"
                            style="display:block;background:#ffffff;color:#0d0d0d;text-decoration:none;font-size:14px;font-weight:700;padding:14px 24px;border-radius:8px;text-align:center;">
                            Accept Invitation
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;">
              <p style="margin:0;color:#333333;font-size:12px;text-align:center;line-height:1.6;">
                You received this because someone invited you to a WebConnect workspace.<br/>
                If you weren't expecting this, you can safely ignore it.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
          const { transporter, mailOptions } = await sendEmail(
            email,
            `You're invited to join ${workspace.name} on WebConnect`,
            `${senderInfo.firstname} ${senderInfo.lastname} invited you to join ${workspace.name}. Accept here: ${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}`,
            emailHtml,
          );
          transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              console.log("🔴", error.message);
            } else {
              console.log("✅", info);
            }
          });
          return { status: 200, data: "Invite sent" };
        }
        return { status: 400, data: "Invitation failed" };
      }
      return { status: 404, data: "Workspace not found" };
    }
    return { status: 404, data: "Receipient not found" };
  } catch (error) {
    return { status: 400, data: "Something went wrong" };
  }
};

export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser();
    if (!user)
      return {
        status: 404,
      };
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        receiver: {
          select: {
            clerkid: true,
          },
        },
      },
    });
    if (user.id !== invitation?.receiver?.clerkid) return { status: 401 };
    const acceptInvite = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    });
    const updateMember = client.user.update({
      where: {
        clerkid: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    });

    const membersTransaction = await client.$transaction([
      acceptInvite,
      updateMember,
    ]);

    if (membersTransaction) {
      return { status: 200 };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 400 };
  }
};

export const completeSubscription = async (sesssion_id: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 404 };
    }
    const session = await stripe.checkout.sessions.retrieve(sesssion_id);
    if (session) {
      const customer = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: "PRO",
              },
            },
          },
        },
      });
      if (customer) {
        return { status: 200 };
      }
    }
    return { status: 404 };
  } catch (error) {
    return { status: 400 };
  }
};
