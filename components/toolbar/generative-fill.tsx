"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import { genFill } from "@/server/gen-fill";
import { Crop } from "lucide-react";

type SizeDisplayProps = {
  label: string;
  width: number;
  height: number;
};

const SizeDisplay = ({ label, width, height }: SizeDisplayProps) => (
  <div className="flex flex-col items-center">
    <span className="text-xs">{label}:</span>
    <p className="text-sm text-primary font-bold">
      {width}x{height}
    </p>
  </div>
);

export default function GenerativeFill() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const PREVIEW_SIZE = 300;
  const EXPANSION_SIZE = 250; // The size of the expansion area in pixels

  const ExpensionIndicator = ({
    value,
    axis,
  }: {
    value: number;
    axis: "width" | "height";
  }) => {
    const isVisible = Math.abs(value) > EXPANSION_SIZE;
    const position =
      axis === "width"
        ? {
            top: "50%",
            [value > 0 ? "right" : "left"]: 0,
            transform: "translate(-50%)",
          }
        : {
            left: "50%",
            [value > 0 ? "bottom" : "top"]: 0,
            transform: "translate(-50%)",
          };

    return (
      isVisible && (
        <div
          className="absolute bg-secondary text-primary rounded-md font-bold text-xs px-2 py-1"
          style={position}
        >
          {Math.abs(value)}px
        </div>
      )
    );
  };

  const previewStyle = useMemo(() => {
    if (!activeLayer.width || !activeLayer.height) return {};

    const newWidth = activeLayer.width + width;
    const newHeight = activeLayer.height + height;
    const scale = Math.min(PREVIEW_SIZE / newWidth, PREVIEW_SIZE / newHeight);

    return {
      width: `${newWidth * scale}px`,
      height: `${newHeight * scale}px`,
      backgroundImage: `url(${activeLayer.url})`,
      backgroundSize: `${activeLayer.width * scale}px ${
        activeLayer.height * scale
      }px`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      position: "relative" as const,
    };
  }, [activeLayer, width, height]);

  const previewOverlayStyle = useMemo(() => {
    if (!activeLayer.width || !activeLayer.height) return {};
    const newWidth = activeLayer.width + width;
    const newHeight = activeLayer.height + height;
    const scale = Math.min(PREVIEW_SIZE / newWidth, PREVIEW_SIZE / newHeight);

    const leftWidth = width > 0 ? `${(width / 2) * scale}px` : "0";
    const rightWidth = width > 0 ? `${(width / 2) * scale}px` : "0";
    const topHeight = height > 0 ? `${(height / 2) * scale}px` : "0";
    const bottomHeight = height > 0 ? `${(height / 2) * scale}px` : "0";

    return {
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      boxShadow: `inset ${leftWidth} ${topHeight} 0 rgba(48, 119, 255, 1), 
                  inset -${rightWidth} ${topHeight} 0 rgba(48, 119, 255, 1), 
                  inset ${leftWidth} -${bottomHeight} 0 rgba(48, 119, 255, 1), 
                  inset -${rightWidth} -${bottomHeight} 0 rgba(48, 119, 255,1)`,
    };
  }, [activeLayer, width, height]);

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex flex-col gap-1 items-center justify-center text-xs font-medium">
            Generative Fill
            <Crop size={16} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="flex flex-col h-full">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Generative Fill</h3>
            <p className="text-xs text-muted-foreground">
              Fill an image with AI
            </p>
          </div>
          {activeLayer.width && activeLayer.height ? (
            <div className="flex justify-evenly">
              <SizeDisplay
                label="Current Size"
                width={activeLayer.width}
                height={activeLayer.height}
              />
              <SizeDisplay
                label="New Size"
                width={activeLayer.width + width}
                height={activeLayer.height + height}
              />
            </div>
          ) : null}
        </div>
        <div className="flex gap-2 items-center justify-center">
          <div className="text-center">
            <Label htmlFor="width">Modify Width</Label>
            <Input
              className="h-8"
              id="width"
              type="range"
              min={-activeLayer.width! + 100}
              max={activeLayer.width}
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
            />
          </div>
          <div className="text-center">
            <Label htmlFor="height">Modify Height</Label>
            <Input
              className="h-8"
              id="height"
              type="range"
              min={-activeLayer.height! + 100}
              max={activeLayer.height}
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div
          style={{
            width: `${PREVIEW_SIZE}px`,
            height: `${PREVIEW_SIZE}px`,
          }}
          className="preview-container flex-grow flex justify-center items-center overflow-hidden m-auto"
        >
          <div style={previewStyle}>
            <div className="animate-pulse" style={previewOverlayStyle}></div>
            <ExpensionIndicator value={width} axis="width" />
            <ExpensionIndicator value={height} axis="height" />
          </div>
        </div>

        <Button
          className="w-full mt-4"
          onClick={async () => {
            const newLayerId = crypto.randomUUID();

            setGenerating(true);
            const res = await genFill({
              activeImage: activeLayer.url!,
              width: (activeLayer.width! + width).toString(),
              height: (activeLayer.height! + height).toString(),
              aspectRatio: "1:1",
            });

            if (res?.data?.success) {
              addLayer({
                id: newLayerId,
                url: res.data.success,
                format: activeLayer.format,
                publicId: activeLayer.publicId,
                height: activeLayer.height! + height,
                width: activeLayer.width! + width,
                name: "genFill-" + activeLayer.name,
                resourceType: "image",
              });

              setActiveLayer(newLayerId);
              setGenerating(false);
            }
          }}
        >
          {generating ? "Generating..." : "Generate"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
