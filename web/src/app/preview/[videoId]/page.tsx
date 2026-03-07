"use client";

import { getPreviewVideo } from "@/actions/workspace";
import VideoPreview from "@/components/globals/videos/preview";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const page = async (props: Props) => {
  const params = useParams<{ videoId: string }>();
  const videoId = params.videoId;

  const query = new QueryClient();

  useEffect(() => {
    query.prefetchQuery({
      queryKey: ["preview-video"],
      queryFn: () => getPreviewVideo(videoId),
    });
  }, [videoId]);

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <VideoPreview videoId={videoId} />
      
    </HydrationBoundary>
  );
};

export default page;
