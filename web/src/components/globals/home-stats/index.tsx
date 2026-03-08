"use client";

import { useWorkspaces } from "@/hooks/use-workspaces";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Video, FolderOpen, CreditCard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  loading?: boolean;
};

const StatCard = ({ icon, label, value, sub, loading }: StatCardProps) => (
  <div className="bg-[#171717] border border-[#252525] rounded-2xl px-6 py-5 flex flex-col gap-y-4">
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#bdbdbd] uppercase tracking-widest font-mono">
        {label}
      </span>
      <div className="text-[#bdbdbd] opacity-50">{icon}</div>
    </div>
    {loading ? (
      <Skeleton className="h-8 w-16 bg-[#252525] rounded-lg" />
    ) : (
      <div>
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-xs text-[#bdbdbd] mt-1">{sub}</div>
      </div>
    )}
  </div>
);

type Props = {
  videoCount: number;
  videosLoading: boolean;
  className?: string;
};

const HomeStats = ({ videoCount, videosLoading, className }: Props) => {
  const { data: workspacesData, isPending: workspacesLoading } = useWorkspaces();
  const { data: userData, isPending: userLoading } = useCurrentUser();

  const plan = userData?.data?.subscription?.plan ?? "FREE";
  const ownedCount = (workspacesData as any)?.data?.workspace?.length ?? 0;
  const memberCount = (workspacesData as any)?.data?.members?.length ?? 0;
  const workspaceCount = ownedCount + memberCount;

  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10", className)}>
      <StatCard
        icon={<Video className="w-4 h-4" />}
        label="Videos"
        value={videoCount}
        sub="in this workspace"
        loading={videosLoading}
      />
      <StatCard
        icon={<FolderOpen className="w-4 h-4" />}
        label="Workspaces"
        value={workspaceCount || "—"}
        sub="total"
        loading={workspacesLoading}
      />
      <StatCard
        icon={<CreditCard className="w-4 h-4" />}
        label="Plan"
        value={plan}
        sub={plan === "FREE" ? "Upgrade for more" : "Active subscription"}
        loading={userLoading}
      />
      <StatCard
        icon={<Sparkles className="w-4 h-4" />}
        label="Transcription"
        value="On"
        sub="Whisper AI enabled"
      />
    </div>
  );
};

export default HomeStats;