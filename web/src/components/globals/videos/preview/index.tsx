"use client";

import { getPreviewVideo, sendEmailForFirstView } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";
import { VideoProps } from "@/types/index.types";
import { useRouter } from "next/navigation";
import Loader from "../../loader";
import CopyLink from "../copy-link";
import RichLink from "../rich-link";
import { truncateString } from "@/lib/utils";
import { DownloadIcon } from "lucide-react";
import TabMenu from "../../tabs";
import AiTools from "../../ai-tools";
import VideoTranscript from "../../video-transcript";
import { TabsContent } from "@radix-ui/react-tabs";
import Activities from "../../activities";
import { useEffect, useState } from "react";
import EditVideo from "../edit";

type Props = {
  videoId: string;
};

const VideoPreview = ({ videoId }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const { data, isPending } = useQueryData(["preview-video"], () =>
    getPreviewVideo(videoId),
  );

  const notifyFirstView = async () => await sendEmailForFirstView(videoId);

  if (isPending)
    return (
      <Loader
        color={"#fff"}
        state={true}
        className="h-screen w-full flex items-center justify-center"
      />
    );
  const { data: video, status, author } = data as VideoProps;
  if (status !== 200) router.push("/");

  const daysAgo = Math.floor(
    (new Date().getTime() - video.createdAt.getTime()) / (24 * 60 * 60 * 1000),
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 py-6 lg:py-10 overflow-y-auto gap-6 px-4 lg:px-0">
      <div className="flex flex-col lg:col-span-2 gap-y-6 lg:gap-y-10">
        <div>
          <div className="flex gap-x-3 items-start justify-between">
            <h2 className="text-white text-2xl md:text-4xl font-bold leading-tight">
              {video.title}
            </h2>
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )}
          </div>
          <span className="flex gap-x-3 mt-2">
            <p className="text-[#9d9d9d] capitalize text-sm md:text-base">
              {video.User?.firstname} {video.User?.lastname}
            </p>
            <p className="text-[#707070] text-sm md:text-base">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </p>
          </span>
        </div>

        <video
        //   poster={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#t=0.1`}
          preload="metadata"
          className={`w-full aspect-video rounded-xl transition-opacity duration-500 ${
            isPlaying ? "opacity-100" : "opacity-50"
          }`}
          controls
          onPlay={() => {
            setIsPlaying(true);
            sendEmailForFirstView(videoId);
          }}
          onPause={() => setIsPlaying(false)}
        >
          <source
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${video.source}#t=0.1`}
          />
        </video>

        <div className="flex flex-col gap-y-3">
          <div className="flex gap-x-3 items-center justify-between">
            <p className="text-[#bdbdbd] font-semibold text-lg md:text-2xl">
              Description
            </p>
            {author ? (
              <EditVideo
                videoId={videoId}
                title={video.title as string}
                description={video.description as string}
              />
            ) : (
              <></>
            )}
          </div>
          <p className="text-[#9d9d9d] text-base md:text-lg">
            {video.description}
          </p>
        </div>
      </div>

      <div className="lg:col-span-1 flex flex-col gap-y-8 lg:gap-y-16">
        <div className="flex justify-start lg:justify-end items-center gap-x-3 flex-wrap gap-y-2">
          <CopyLink
            variant={"outline"}
            className="rounded-full bg-transparent! px-6! md:px-10!"
            videoId={videoId}
          />
          <RichLink
            id={videoId}
            description={truncateString(video.description as string, 150)}
            source={video.source}
            title={video.title as string}
          />
          <DownloadIcon className="text-[#4d4c4c] cursor-pointer hover:text-[#9d9d9d] transition-colors" />
        </div>
        <div>
          <TabMenu
            defaultValue="Ai tools"
            triggers={["Ai tools", "Transcript", "Activity"]}
          >
            <AiTools
              videoId={videoId}
              trial={video.User?.trial!}
              plan={video.User?.subscription?.plan!}
            />
            <VideoTranscript description={video.summary!} />
            <Activities
              author={video.User?.firstname as string}
              videoId={videoId}
            />
          </TabMenu>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
