"use client";

import { Button } from "@/components/ui/button";
import CreateWorkspace from "@/components/globals/create-workspace";
import CreateFolders from "@/components/globals/create-folders";
import { Upload, Video } from "lucide-react";

type Props = {
  workspaceId: string;
};

const QuickActions = ({ workspaceId }: Props) => {
  return (
    <div className="flex items-center gap-x-3 mb-10 flex-wrap gap-y-3">
      <Button className="bg-[#7320DD] hover:bg-[#7320DD]/80 text-white flex items-center gap-x-2 rounded-full px-5">
        <Video className="w-4 h-4" />
        Record
      </Button>
      <Button
        variant="outline"
        className="border-[#252525] bg-transparent text-[#bdbdbd] hover:text-white hover:bg-[#252525] flex items-center gap-x-2 rounded-full px-5"
      >
        <Upload className="w-4 h-4" />
        Upload
      </Button>
      <div className="ml-auto flex items-center gap-x-3">
        <CreateWorkspace />
        <CreateFolders workspaceId={workspaceId} />
      </div>
    </div>
  );
};

export default QuickActions;