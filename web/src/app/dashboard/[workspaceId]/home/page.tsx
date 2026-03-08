"use client";

import { useParams } from "next/navigation";
import HomeGreeting from "@/components/globals/home-greeting";
import HomeStats from "@/components/globals/home-stats";
import QuickActions from "@/components/globals/quick-actions";
import RecentVideos from "@/components/globals/recent-videos";
import UpgradeBanner from "@/components/globals/upgrade-banner";
import Folders from "@/components/globals/folders";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useQueryData } from "@/hooks/useQueryData";
import { getWorkSpaces } from "@/actions/workspace";

const Page = () => {
  const params = useParams<{ workspaceId: string }>();

  const { data } = useQueryData(["user-workspaces"], getWorkSpaces);

  const workspace = data as {
    status: number;
    data: {
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
  };

  const plan = workspace?.data?.subscription?.plan ?? "FREE";

  return (
    <div className="mt-6">
      <HomeGreeting />

      {plan === "FREE" && <UpgradeBanner />}

      <HomeStats className="mt-10 bg-red" videoCount={0} videosLoading={false} />
    </div>
  );
};

export default Page;
