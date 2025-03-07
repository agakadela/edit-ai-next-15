/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Image } from "lucide-react";
import { extractPart } from "@/server/extract-part";
import { useState } from "react";

export default function ExtractPart() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const [prompts, setPrompts] = useState<string[]>([]);
  const [multiple, setMultiple] = useState<boolean>(false);
  const [mode, setMode] = useState<"default" | "custom">("default");
  const [invert, setInvert] = useState<boolean>(false);

  const addPrompt = (prompt: string) => {
    setPrompts([...prompts, prompt]);
  };

  const updatePrompt = (index: number, prompt: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = prompt;
    setPrompts(newPrompts);
  };

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex flex-col gap-1 items-center justify-center text-xs font-medium">
            Extract Part
            <Image size={16} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div>
          <h3 className="text-sm font-medium">Extract Part</h3>
          <p className="text-xs text-muted-foreground">
            Extract part of an image with AI
          </p>
        </div>
        <div className="">
          <Button
            disabled={!activeLayer?.url || generating}
            className="w-full mt-4"
            onClick={async () => {
              const newLayerId = crypto.randomUUID();

              setGenerating(true);
              const res = await bgRemove({
                format: activeLayer.format!,
                activeImage: activeLayer.url!,
              });

              if (res?.data?.success) {
                addLayer({
                  id: newLayerId,
                  url: res.data.success,
                  format: "png",
                  publicId: activeLayer.publicId,
                  height: activeLayer.height,
                  width: activeLayer.width,
                  name: "bgReplaced-" + activeLayer.name,
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
            {generating ? "Generating..." : "Extract Part"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
