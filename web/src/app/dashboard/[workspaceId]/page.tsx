'use client'

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateFolders from "@/components/globals/create-folders";
import CreateWorkspace from "@/components/globals/create-workspace";
import Folders from "@/components/globals/folders";
import Videos from "@/components/globals/videos";

const Page = () => {    
  const params = useParams<{ workspaceId: string }>();
  const workspaceId = params.workspaceId;

  return (
    <div>
      <Tabs defaultValue="videos" className="mt-6">
        <div className="flex flex-wrap w-full justify-between items-center gap-y-3">
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
          <div className="flex gap-x-3 flex-wrap gap-y-3">
            <CreateWorkspace />
            <CreateFolders workspaceId={workspaceId} />
          </div>
        </div>
        <section className="py-9">
          <TabsContent value="videos">
            <Folders workspaceId={workspaceId} />
            <div className="my-8 border-t border-[#252525]" />
            <Videos
              workspaceId={workspaceId}
              folderId={workspaceId}
              videosKey="user-videos"
            />
          </TabsContent>
          <TabsContent value="archive">
            <p className="text-[#bdbdbd]">Archived content will appear here.</p>
          </TabsContent>
        </section>
      </Tabs>
    </div>
  );
};

export default Page;