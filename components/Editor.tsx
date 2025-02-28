"use client";

import Layers from "@/components/layers/layers";
import { ModeToggle } from "@/components/theme/mode-toggle";
import ActiveImage from "./active-image";
import UploadForm from "./upload/upload-form";
import { useLayerStore } from "@/lib/layer-store";
import ImageToolbar from "./toolbar/image-toolbar";

export default function Editor() {
  const activeLayer = useLayerStore((state) => state.activeLayer);
  return (
    <div className="flex h-full">
      <div className="py-6 px-4 basis-[360px] shrink-0">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
        <div className="flex flex-col gap-4">
          {activeLayer.resourceType === "image" ? <ImageToolbar /> : null}
        </div>
      </div>
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}
