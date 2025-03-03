"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { genRemove } from "@/server/gen-remove";
import { Eraser } from "lucide-react";

export default function GenRemove() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const [activeTag, setActiveTag] = useState("");

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex flex-col gap-1 items-center justify-center text-xs font-medium">
            Content Remove
            <Eraser size={16} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div>
          <h3 className="text-sm font-medium">Smart AI Remove</h3>
          <p className="text-xs text-muted-foreground">
            Remove objects from an image with AI
          </p>
        </div>
        <div className="grid grid-cols-3 items-center gap-2">
          <Label htmlFor="selection">Selection</Label>
          <Input
            id="selection"
            type="text"
            className="col-span-2 h-8"
            value={activeTag}
            onChange={(e) => setActiveTag(e.target.value)}
          />
        </div>
        <Button
          className="w-full mt-4"
          onClick={async () => {
            const newLayerId = crypto.randomUUID();

            setGenerating(true);
            const res = await genRemove({
              prompt: activeTag,
              activeImage: activeLayer.url!,
            });

            if (res?.data?.success) {
              addLayer({
                id: newLayerId,
                url: res.data.success,
                format: activeLayer.format,
                publicId: activeLayer.publicId,
                height: activeLayer.height,
                width: activeLayer.width,
                name: "genRemoved-" + activeLayer.name,
                resourceType: "image",
              });

              setActiveLayer(newLayerId);
              setGenerating(false);
            }
          }}
        >
          Magic Remove
        </Button>
      </PopoverContent>
    </Popover>
  );
}
