"use client";
import { Layer, useLayerStore } from "@/lib/layer-store";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EllipsisIcon, Trash2 } from "lucide-react";

export default function LayerInfo({
  layer,
  layerIndex,
}: {
  layer: Layer;
  layerIndex: number;
}) {
  const layers = useLayerStore((state) => state.layers);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const removeLayer = useLayerStore((state) => state.removeLayer);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <EllipsisIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Layer: {layer.name}</DialogTitle>

        <div className="py-4 space-y-0.5">
          <p>
            <span className="font-bold">Filename:</span> {layer.name}
          </p>
          <p>
            <span className="font-bold">Format:</span> {layer.format}
          </p>
          <p>
            <span className="font-bold">Size:</span> {layer.width}x
            {layer.height}
          </p>
        </div>

        <Button
          className="cursor-pointer"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            setActiveLayer(layerIndex === 0 ? layers[1].id : layers[0].id);
            removeLayer(layer.id);
          }}
        >
          <Trash2 size={16} />
          <span>Delete layer</span>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
