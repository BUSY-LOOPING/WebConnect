"use client";

import { getWorkSpaces } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";

export const useWorkspaces = () => {
  const { data, isPending } = useQueryData(["workspaces"], getWorkSpaces);
  return { data: data as Awaited<ReturnType<typeof getWorkSpaces>>, isPending };
};