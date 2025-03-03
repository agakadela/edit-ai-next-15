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
import { ArrowRight, Images, Layers2 } from "lucide-react";
import LayerImage from "./layer-image";
import LayerInfo from "./layer-info";
import { useMemo } from "react";
import Image from "next/image";

export default function Layers() {
  const layers = useLayerStore((state) => state.layers);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const generating = useImageStore((state) => state.generating);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const setLayerComparisonMode = useLayerStore(
    (state) => state.setLayerComparisonMode
  );
  const layerComparisonMode = useLayerStore(
    (state) => state.layerComparisonMode
  );
  const comparedLayers = useLayerStore((state) => state.comparedLayers);
  const setComparedLayers = useLayerStore((state) => state.setComparedLayers);
  const toggleComparedLayer = useLayerStore(
    (state) => state.toggleComparedLayer
  );

  const getLayerName = useMemo(
    () => (id: string) => {
      const layer = layers.find((l) => l.id === id);
      return layer ? layer.url : "Nothing selected";
    },
    [layers]
  );

  const visibleLayers = useMemo(
    () =>
      layerComparisonMode
        ? layers.filter((layer) => layer.url && layer.resourceType === "image")
        : layers,
    [layerComparisonMode, layers]
  );

  return (
    <Card className="shrink-0 scrollbar-thin scrollbar-track-secondary overflow-y-scroll scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-x-hidden relative flex flex-col shadow-2xl">
      <CardHeader className="sticky top-0 z-50 px-4 py-6 min-h-28 bg-card shadow-sm">
        {layerComparisonMode ? (
          <div>
            <CardTitle className="text-lg font-semibold ">
              {activeLayer?.name || "Layers"}
            </CardTitle>
            <CardDescription>
              <Image
                alt="compare"
                width={32}
                height={32}
                src={(getLayerName(comparedLayers[0]) as string) || ""}
              />
              {comparedLayers.length > 1 && <ArrowRight />}
              {comparedLayers.length > 1 ? (
                <Image
                  alt="compare"
                  width={32}
                  height={32}
                  src={getLayerName(comparedLayers[1]) as string}
                />
              ) : (
                "Nothing selected"
              )}
            </CardDescription>
          </div>
        ) : null}
        <CardTitle className="text-lg font-semibold ">
          {activeLayer?.name || "Layers"}
        </CardTitle>
        {activeLayer.width && activeLayer.height ? (
          <CardDescription>
            {activeLayer.width}x{activeLayer.height}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {visibleLayers.map((layer, index) => (
          <div
            key={layer.id}
            onClick={() => {
              if (generating) return;
              if (layerComparisonMode) {
                toggleComparedLayer(layer.id);
              } else {
                setActiveLayer(layer.id);
              }
            }}
            className={cn(
              "cursor-pointer ease-in-out hover:bg-secondary border border-transparent",
              {
                "animate-pulse": generating,
                "border-primary": layerComparisonMode
                  ? comparedLayers.includes(layer.id)
                  : activeLayer?.id === layer.id,
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
                <LayerImage layer={layer} />
                <LayerInfo layer={layer} layerIndex={index} />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="sticky bottom-0 bg-card flex gap-2 px-4 shrink-0">
        <Button
          onClick={() =>
            addLayer({
              id: crypto.randomUUID(),
              name: "New Layer",
              url: "",
              width: 0,
              height: 0,
            })
          }
          className="w-full flex gap-2"
          variant="outline"
        >
          <span>Create new layer</span>
          <Layers2 size={18} className="text-secondary-foreground" />
        </Button>
        <Button
          className="flex items-center gap-2"
          onClick={() => {
            if (layerComparisonMode) {
              setLayerComparisonMode(!layerComparisonMode);
            } else {
              setComparedLayers([activeLayer.id]);
            }
          }}
          variant="outline"
          disabled={!activeLayer.url || activeLayer.resourceType !== "image"}
        >
          <span>
            {layerComparisonMode ? "Stop comparing" : "Compare layers"}
          </span>
          {!layerComparisonMode && (
            <Images className="text-secondary-foreground" size={18} />
          )}
        </Button>
      </div>
    </Card>
  );
}
