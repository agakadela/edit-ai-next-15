"use client";
import React from "react";
import UploadImage from "@/components/upload/upload-image";
import Layers from "@/components/layers/layers";
import { ModeToggle } from "@/components/theme/mode-toggle";
import ActiveImage from "./active-image";

export default function Editor() {
  return (
    <div className="flex h-full">
      <div className="py-6 px-4 basis-[360px] shrink-0">
        <div className="pb-12 text-center">
          <ModeToggle />
        </div>
      </div>
      <UploadImage />
      <ActiveImage />
      <Layers />
    </div>
  );
}
