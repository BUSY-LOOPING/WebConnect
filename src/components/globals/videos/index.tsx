"use client";

import { getAllUserVideos } from "@/actions/workspace";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { useQueryData } from "@/hooks/useQueryData";
import { cn } from "@/lib/utils";
import { VideosProps } from "@/types/index.types";
import React from "react";
import VideoCard from "./video-card";

type Props = {
  folderId: string;
  videosKey: string;
  workspaceId: string;
};

const Videos = ({ folderId, videosKey, workspaceId }: Props) => {
  const { data: videoData, isPending, isFetching } = useQueryData([videosKey], () =>
    getAllUserVideos(folderId)
  );

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#bdbdbd] text-xl">Videos</h2>
        </div>
        <p className="text-[#bdbdbd]">Loading videos...</p>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#bdbdbd] text-xl">Videos</h2>
        </div>
        <p className="text-[#bdbdbd]">No data available</p>
      </div>
    );
  }

  const { status: videosStatus, data: videos } = videoData as VideosProps;
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VideoRecorderDuotone />
          <h2 className="text-[#bdbdbd] text-xl">Videos</h2>
        </div>
      </div>
      <section
        className={cn(
          videosStatus !== 200
            ? "p-5"
            : "grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid:cols-4 2xl:grid-cols-5"
        )}
      >
        {videosStatus === 200 && videos && videos.length > 0
          ? videos.map((video) => (
              <VideoCard key={video.id} workspaceId={workspaceId} {...video} />
            ))
          : <p className="text-[#bdbdbd]">No videos in workspacee</p>}
      </section>
    </div>
  );
};

export default Videos;
