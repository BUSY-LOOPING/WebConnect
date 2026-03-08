import React from "react";
import Loader from "../loader";
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

const VideoCard = (props: Props) => {
  const daysAgo = Math.floor(
    (new Date().getTime() - props.createdAt.getTime()) / (24 * 60 * 60 * 1000),
  );

  return (
    <Loader
      className="bg-[#171717] flex justify-center items-center border border-[#252525] rounded-xl"
      state={props.processing}
    >
      <div className="group overflow-hidden cursor-pointer bg-[#171717] relative border border-[#252525] flex flex-col rounded-xl">
        <div className="absolute top-3 right-3 z-50 hidden items-center justify-center gap-x-3 group-hover:flex">
          <CardMenu
            currentFolder={props.Folder?.id}
            videoId={props.id}
            currentWorkspace={props.workspaceId}
            currentFolderName={props.Folder?.name}
          />
          <CopyLink
            className="bg-[#252525] p-0 h-5 bg-hover:bg-transparent"
            videoId={props.id}
          />
        </div>
        <Link
          href={`/dashboard/${props.workspaceId}/video/${props.id}`}
          // href={`/`}
          className="hover:bg-[#252525] transition duration-150 flex flex-col justify-between h-full"
        >
          {" "}
          <video
            // poster={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=0.1`}
            controls={false}
            preload="metadata"
            className="w-full aspect-video opacity-50 z-20"
          >
            <source
              src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${props.source}#t=0.1`}
            />
          </video>
          <div className="flex flex-col gap-y-2 z-20 px-5 py-3">
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
                <p className="captialize text-xs text-[#bdbdbd]">
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
    </Loader>
  );
};

export default VideoCard;
