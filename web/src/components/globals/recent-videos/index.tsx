"use client";

import Videos from "@/components/globals/videos";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  workspaceId: string;
};

const RecentVideos = ({ workspaceId }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-[#bdbdbd] uppercase tracking-widest font-mono mb-1">
            Recent
          </p>
          <h2 className="text-xl font-bold text-white">Videos</h2>
        </div>
        <Link
          href={`/dashboard/${workspaceId}`}
          className="flex items-center gap-x-1.5 text-sm text-[#bdbdbd] hover:text-white transition-colors"
        >
          See all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Videos
        workspaceId={workspaceId}
        folderId={workspaceId}
        videosKey="home-recent-videos"
      />
    </div>
  );
};

export default RecentVideos;