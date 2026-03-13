"use client";

import VideoRecorderIcon from "@/components/icons/video-recorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";
import { Search, UploadCloud } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {};

const InfoBar = (props: Props) => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const workspaceId = segments[2];
  const folderIndex = segments.indexOf("folder");
  const folderId = folderIndex !== -1 ? segments[folderIndex + 1] : null;

  const recordHref = folderId
    ? `/dashboard/${workspaceId}/record?folderId=${folderId}`
    : `/dashboard/${workspaceId}/record`;
    
  return (
    <header className="md:pl-[270px] fixed top-0 left-0 right-0 px-4 h-16 w-full flex items-center justify-between gap-2 md:gap-4 pl-14 z-10 bg-[#171717]">
      <div className="flex gap-2 justify-center items-center border-2 rounded-full px-3 md:px-4 flex-1 max-w-lg">
        <Search size={20} className="text-[#707070] shrink-0" />
        <Input
          className="bg-transparent! border-none! focus-visible:ring-0 placeholder-neutral-500! text-sm w-full"
          placeholder="Search..."
        />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button className="bg-[#9d9d9d] flex items-center gap-1 md:gap-2 px-2 md:px-4 text-xs md:text-sm">
          <UploadCloud size={18} />
          <span className="hidden sm:inline">Upload</span>
        </Button>
        <Link href={recordHref}>
          <Button className="bg-[#9d9d9d] flex items-center gap-1 md:gap-2 px-2 md:px-4 text-xs md:text-sm">
            <VideoRecorderIcon />
            <span className="hidden sm:inline">Record</span>
          </Button>
        </Link>
        <UserButton />
      </div>
    </header>
  );
};

export default InfoBar;
