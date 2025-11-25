import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import Loader from "../loader";
import VideoRecorderDuotone from "@/components/icons/video-recorder-duotone";
import { FileDuoToneBlack } from "@/components/icons";
import { DownloadIcon, Pencil, StarsIcon } from "lucide-react";

type Props = {
  plan: "PRO" | "FREE";
  trial: boolean;
  videoId: string;
};

const AiTools = ({ plan, trial, videoId }: Props) => {
  return (
    <TabsContent
      value="Ai tools"
      className="p-5 bg-[#1d1d1d] rounded-xl flex flex-col gap-y-10"
    >
      {" "}
      <div className="flex items-center justify-between">
        <div className="w-8/12">
          <h2 className="text-3xl font-bold">AI Tools</h2>
          <p className="text-[#bdbdbd]">
            Taking your videos to the next <br />
            step with the power of AI!
          </p>
        </div>

        <div>
          {plan === "FREE" ? (
            !trial ? (
              <div className="flex items-center justify-between gap-4">
                <Button variant={"secondary"} className=" mt-2 text-sm">
                  <Loader state={false} color="#000">
                    Try now
                  </Loader>
                </Button>

                <Button className=" mt-2 text-sm">
                <Loader state={false} color="#000">
                  Pay Now
                </Loader>
              </Button>
              </div>
            ) : (
              <Button className=" mt-2 text-sm">
                <Loader state={false} color="#000">
                  Pay Now
                </Loader>
              </Button>
            )
          ) : (
            <Button className=" mt-2 text-sm">
              <Loader state={false} color="#000">
                Generate Now
              </Loader>
            </Button>
          )}
        </div>
      </div>
      <div className="gap-4 flex flex-col p-4 rounded-xl bg-[#1b0f1b7f] border">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-bold text-[#a22fe0]">Opal AI</h2>
          <StarsIcon color="#a22fe0" fill="#a22fe0" />
        </div>

        <div className="flex gap-2 items-start">
          <div className="p-2 rounded-full border-[#2d2d2d] border-2 bg-[#2b2b2b]">
            <Pencil color="#a22fe0" />
          </div>
          <div>
            <h3 className="text-xl font-medium">Summary</h3>
            <p className="text-muted-foreground text-sm">
              Generate a description for your video using AI.
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <div className="p-2 rounded-full border-[#2d2d2d] border-2 bg-[#2b2b2b]">
            <Pencil color="#a22fe0" />
          </div>
          <div>
            <h3 className="text-xl font-medium">Summary</h3>
            <p className="text-muted-foreground text-sm">
              Generate a description for your video using AI.
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-start">
          <div className="p-2 rounded-full border-[#2d2d2d] border-2 bg-[#2b2b2b]">
            <Pencil color="#a22fe0" />
          </div>
          <div>
            <h3 className="text-xl font-medium">AI Agent</h3>
            <p className="text-muted-foreground text-sm">
              Viewers can ask questions on your videos and out AI agent will
              respond
            </p>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default AiTools;
