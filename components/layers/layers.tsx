"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLayerStore } from "@/lib/layer-store";
import { useImageStore } from "@/lib/image-store";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Layers2 } from "lucide-react";

export default function Layers() {
  const layers = useLayerStore((state) => state.layers);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const generating = useImageStore((state) => state.generating);
  return (
    <Card className="basis-[320px] shrink-0  scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl">
      <CardHeader className=" p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {activeLayer?.name || "Layers"}
        </CardTitle>
        {activeLayer.width && activeLayer.height ? (
          <CardDescription>
            {activeLayer.width}x{activeLayer.height}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className={cn(
              "cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
              {
                "animate-pulse": generating,
              }
            )}
          >
            <div className="relative p-4 flex items-center">
              <div className="flex gap-2 items-center h-8 w-full justify-between">
                {!layer.url ? (
                  <p className="text-xs fonr-medium justify-self-end">
                    New layer
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="sticky bottom-0 bg-card flex gap-2 shrink-0">
        <Button className="w-full flex gap-2" variant="outline">
          <span>Create new layer</span>
          <Layers2 size={18} className="text-secondary-foreground" />
        </Button>
      </div>
    </Card>
  );
}
