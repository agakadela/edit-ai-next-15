/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ImageOff } from "lucide-react";
import { bgReplace } from "@/server/bg-replace";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

export default function BgReplace() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const [prompt, setPrompt] = useState("");

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex flex-col gap-1 items-center justify-center text-xs font-medium">
            Background Replace
            <ImageOff size={16} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div>
          <h3 className="text-sm font-medium">Smart Background Replace</h3>
          <p className="text-xs text-muted-foreground">
            Replace background from an image with AI
          </p>
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              id="prompt"
              type="text"
              className="col-span-2 h-8"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the new background"
            />
          </div>
        </div>
        <div className="">
          <Button
            disabled={!activeLayer?.url || generating}
            className="w-full mt-4"
            onClick={async () => {
              const newLayerId = crypto.randomUUID();

              setGenerating(true);
              const res = await bgReplace({
                activeImage: activeLayer.url!,
                prompt,
              });

              if (res?.data?.success) {
                addLayer({
                  id: newLayerId,
                  url: res.data.success,
                  format: "png",
                  publicId: activeLayer.publicId,
                  height: activeLayer.height,
                  width: activeLayer.width,
                  name: "bgRemoved-" + activeLayer.name,
                  resourceType: "image",
                });

                setActiveLayer(newLayerId);
                setGenerating(false);

                if (res?.serverError) {
                  setGenerating(false);
                }
              }
            }}
          >
            {generating ? "Generating..." : "Replace Background"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
