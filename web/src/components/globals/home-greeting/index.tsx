"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";

const HomeGreeting = () => {
  const { data, isPending } = useCurrentUser();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const firstName = data?.data?.firstname ?? "";

  return (
    <div className="mb-10">
      <p className="text-[#bdbdbd] text-sm uppercase tracking-widest font-mono mb-2">
        Home
      </p>
      {isPending ? (
        <Skeleton className="h-10 w-72 bg-[#252525] rounded-lg" />
      ) : (
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {getGreeting()}{firstName ? `, ${firstName}` : ""}.
        </h1>
      )}
    </div>
  );
};

export default HomeGreeting;