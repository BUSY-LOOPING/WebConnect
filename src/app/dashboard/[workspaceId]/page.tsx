'use client'

import { getWorkspaceFolders } from "@/actions/workspace";
import CreateFolders from "@/components/globals/create-folders";
import CreateWorkspace from "@/components/globals/create-workspace";
import Folders from "@/components/globals/folders";
import Videos from "@/components/globals/videos";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { FOLDERS } from "@/redux/slices/folders";
import { useAppSelector } from "@/redux/store";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;
  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex w-full justify-between items-center">
          <TabsList className="bg-transparent! gap-2 pl-0">
            <TabsTrigger
              className="p-[12px] px-6 rounded-full data-[state=active]:bg-[#252525] data-[state=active]:text-white"
              value="videos"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="p-[12px] px-6 rounded-full data-[state=active]:bg-[#252525] data-[state=active]:text-white"
            >
              Archive
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-x-3">
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>
        <section className="py-9">
          <TabsContent value="videos">
            <Folders workspaceId={workspaceId} />
            
          </TabsContent>
        </section>
      </Tabs>
    </div>
  );
};

export default Page;
