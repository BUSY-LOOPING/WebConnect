"use client";

import { getUser } from "@/actions/user";
import { useQueryData } from "@/hooks/useQueryData";

export const useCurrentUser = () => {
  const { data, isPending } = useQueryData(["current-user"], getUser);
  return { data: data as Awaited<ReturnType<typeof getUser>>, isPending };
};