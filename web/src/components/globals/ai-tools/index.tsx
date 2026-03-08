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
      className="p-3 md:p-5 bg-[#1d1d1d] rounded-xl flex flex-col gap-y-6 md:gap-y-10"
    >
      <div className="flex items-center justify-between gap-x-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-3xl font-bold">AI Tools</h2>
          <p className="text-[#bdbdbd] text-sm md:text-base">
            Taking your videos to the next step with the power of AI!
          </p>
        </div>
        <div className="shrink-0">{/* buttons unchanged */}</div>
      </div>
      <div className="gap-3 md:gap-4 flex flex-col p-3 md:p-4 rounded-xl bg-[#1b0f1b7f] border">
        <div className="flex gap-2 items-center">
          <h2 className="text-lg md:text-2xl font-bold text-[#a22fe0]">
            WebConnect AI
          </h2>
          <StarsIcon color="#a22fe0" fill="#a22fe0" />
        </div>
        {/* feature rows */}
        {[
          {
            title: "Summary",
            desc: "Generate a description for your video using AI.",
          },
          {
            title: "Summary",
            desc: "Generate a description for your video using AI.",
          },
          {
            title: "AI Agent",
            desc: "Viewers can ask questions on your videos and our AI agent will respond",
          },
        ].map((item) => (
          <div key={item.title + item.desc} className="flex gap-2 items-start">
            <div className="p-1.5 md:p-2 rounded-full border-[#2d2d2d] border-2 bg-[#2b2b2b] shrink-0">
              <Pencil color="#a22fe0" size={16} />
            </div>
            <div>
              <h3 className="text-base md:text-xl font-medium">{item.title}</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
};

export default AiTools;
