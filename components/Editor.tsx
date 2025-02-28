"use client";

import Layers from "@/components/layers/layers";
import { ModeToggle } from "@/components/theme/mode-toggle";
import ActiveImage from "./active-image";
import UploadForm from "./upload/upload-form";

export default function Editor() {
  return (
    <div className="flex h-full">
      <div className="py-6 px-4 basis-[360px] shrink-0">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
      </div>
      <UploadForm />
      <ActiveImage />
      <Layers />
    </div>
  );
}
