"use client";

import React from "react";
import CardMenu from "./video-card-menu";
import CopyLink from "./copy-link";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot, Share2, User } from "lucide-react";

type Props = {
  User: {
    firstname: string | null;
    lastname: string | null;
    image: string | null;
  } | null;
  id: string;
  Folder: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  title: string | null;
  source: string;
  processing: boolean;
  workspaceId: string;
};

// Shimmer skeleton shown while video is processing
const VideoCardSkeleton = () => (
  <div className="bg-[#171717] border border-[#252525] rounded-xl overflow-hidden flex flex-col animate-pulse">
    {/* Thumbnail shimmer */}
    <div className="w-full aspect-video relative overflow-hidden bg-[#1f1f1f]">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent" />
    </div>

    {/* Text shimmer */}
    <div className="px-5 py-3 flex flex-col gap-y-3">
      <div className="h-3 w-3/4 rounded-full bg-[#252525] relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.1s] bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent" />
      </div>
      <div className="flex items-center gap-x-2 mt-2">
        <div className="w-8 h-8 rounded-full bg-[#252525] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.2s] bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent" />
        </div>
        <div className="flex flex-col gap-y-1 flex-1">
          <div className="h-2.5 w-1/2 rounded-full bg-[#252525] relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.3s] bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent" />
          </div>
          <div className="h-2 w-1/3 rounded-full bg-[#252525] relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.4s] bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent" />
          </div>
        </div>
      </div>
      <div className="h-2 w-2/5 rounded-full bg-[#252525] relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite_0.5s] bg-gradient-to-r from-transparent via-[#ffffff08] to-transparent" />
      </div>
    </div>
  </div>
);

const VideoCard = (props: Props) => {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (!props.source) return <VideoCardSkeleton />;

  return (
    <div className="group overflow-hidden cursor-pointer bg-[#171717] relative border border-[#252525] flex flex-col rounded-xl">
      
      {/* Action buttons — always visible on mobile, hover on desktop */}
      <div className="absolute top-3 right-3 z-50 flex items-center justify-center gap-x-2
                      opacity-100 duration-150">
        <CardMenu
          currentFolder={props.Folder?.id}
          videoId={props.id}
          currentWorkspace={props.workspaceId}
          currentFolderName={props.Folder?.name}
        />
        <CopyLink
          className="bg-[#8b8b8b] p-0 h-5"
          videoId={props.id}
        />
      </div>

      <Link
        href={`/dashboard/${props.workspaceId}/video/${props.id}`}
        className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full"
      >
        <video
          controls={false}
          preload="metadata"
          className="w-full aspect-video opacity-50"
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}`}
            type="video/mp4"
          />
        </video>

        <div className="flex flex-col gap-y-2 px-5 py-3">
          <h2 className="text-sm font-semibold text-[#bdbdbd]">
            {props.title}
          </h2>
          <div className="flex gap-x-2 items-center mt-4">
            <Avatar className="w-8 h-8">
              <AvatarImage src={props.User?.image as string} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="capitalize text-xs text-[#bdbdbd]">
                {props.User?.firstname} {props.User?.lastname}
              </p>
              <p className="text-[#707070] text-xs flex items-center">
                <Dot />
                {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
              </p>
            </div>
          </div>
          <div>
            <span className="flex gap-x-1 items-center">
              <Share2 fill="#9d9d9d" className="text-[#9d9d9d]" size={12} />
              <p className="text-xs text-[#9d9d9d] capitalize">
                {props.User?.firstname}'s Workspace
              </p>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;