import Loader from "@/components/globals/loader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMoveVideos } from "@/hooks/useFolders";

type Props = {
  videoId: string;
  currentFolder?: string;
  currentWorkspace?: string;
  currentFolderName?: string;
};

const ChangeVideoLocation = ({
  videoId,
  currentFolder,
  currentWorkspace,
  currentFolderName,
}: Props) => {
  const {
    onFormSubmit,
    errors,
    register,
    isPending,
    folders,
    workspaces,
    isFetching,
    isFolders,
  } = useMoveVideos(videoId, currentWorkspace!);

  const folder = folders.find((f) => f.id === currentFolder);
  const workspace = workspaces.find((w) => w.id === currentWorkspace);

  return (
    <form className="w-full flex flex-col gap-y-5" onSubmit={onFormSubmit}>
      <div className="border rounded-xl p-5">
        <h2 className="text-xs text-[#a4a4a4]">Current Workspace</h2>
        {workspace && <p>{workspace.name}</p>}
        <h2 className="text-xs text-[#a4a4a4] mt-4">Current Folder</h2>
        {folder ? <p>{folder.name}</p> : "This video has no folder"}
      </div>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-y-5 p-5 border rounded-xl">
        <h2>To</h2>
        <Label className="flex-col gap-y-2 flex">
          <p className="w-full text-xs">Workspace</p>
          <select
            className="w-full rounded-lg h-12 px-4 bg-[#1c1c1c] border border-[#2d2d2d] text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent cursor-pointer"
            defaultValue={workspace?.id}
            {...register("workspace_id")}
          >
            <option value="" disabled className="bg-[#1c1c1c] text-[#888]">
              Select a workspace
            </option>
            {workspaces.map((space) => (
              <option
                key={space.id}
                value={space.id}
                className="bg-[#1c1c1c]! text-[#e0e0e0] py-2"
              >
                {space.name}
              </option>
            ))}
          </select>
        </Label>
        {isFetching ? (
          <Skeleton className="w-full h-[48px] rounded-xl" />
        ) : (
          <Label className="flex flex-col gap-y-2">
            <p className="w-full text-xs">Folders in this workspace</p>
            {isFolders && isFolders.length > 0 ? (
              <select
                className="w-full rounded-lg h-12 px-4 bg-[#1c1c1c] border border-[#2d2d2d] text-[#e0e0e0] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent cursor-pointer"
                defaultValue={folder?.id}
                {...register("folder_id")}
              >
                <option value="" disabled className="bg-[#1c1c1c] text-[#888]">
                  Select a folder
                </option>
                {isFolders.map((folderItem) => (
                  <option
                    key={folderItem.id}
                    value={folderItem.id}
                    className="bg-[#1c1c1c]! text-[#e0e0e0] py-2"
                  >
                    {folderItem.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-[#a4a4a4] text-sm">
                This workspace has no folders
              </p>
            )}
          </Label>
        )}
      </div>
      <Button>
        <Loader state={isPending} color="#000">
          Transfer
        </Loader>
      </Button>
    </form>
  );
};

export default ChangeVideoLocation;
