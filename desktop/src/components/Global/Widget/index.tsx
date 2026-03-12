import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader } from "../Loader";
import { fetchUserProfile } from "@/lib/utils";
import { useMediaResource } from "@/hooks/useMediaResouce";
import MediaConfiguration from "../MediaConfiguration";

const Widget = () => {
  const [profile, setProfile] = useState<{
    status: number;
    user:
      | ({
          subscription: {
            plan: "PRO" | "FREE";
          } | null;
          studio: {
            id: string;
            screen: string | null;
            mic: string | null;
            preset: "HD" | "SD";
            camera: string | null;
            userId: string | null;
          } | null;
        } & {
          id: string;
          email: string;
          firstname: string | null;
          lastname: string | null;
          createdAt: Date;
          clerkid: string;
        })
      | null;
  } | null>(null);
  const { user } = useUser();
  const { state, fetchMediaResources, toggleSystemAudio } = useMediaResource();

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id).then((p) => {
        setProfile(p);
      });
    }
  }, [user]);

  useEffect(() => {
    fetchMediaResources();
  }, []);

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfiguration state={state} user={profile.user} onToggleSystemAudio={toggleSystemAudio}/>
        ) : (
          <div className="h-full w-full justify-center items-center">
            <Loader color="#fff" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
