"use client";

import { getAllUserVideos } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";

export const useRecentVideos = (workspaceId: string) => {
  const { data, isPending } = useQueryData(
    ["recent-videos", workspaceId],
    () => getAllUserVideos(workspaceId),
    !!workspaceId
  );
  return {
    data: data as Awaited<ReturnType<typeof getAllUserVideos>>,
    isPending,
  };
};