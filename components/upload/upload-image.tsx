import { uploadImage } from "@/server/upload-image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLayerStore } from "@/lib/layer-store";
import { useImageStore } from "@/lib/image-store";
export default function UploadImage() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const updateLayer = useLayerStore((state) => state.updateLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg"],
      "image/webp": [".webp"],
      "image/jpg": [".jpg"],
    },
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length) {
        console.log(fileRejections);
      }
      if (acceptedFiles.length) {
        const formData = new FormData();
        console.log(acceptedFiles[0]);
        formData.append("image", acceptedFiles[0]);

        const objectUrl = URL.createObjectURL(acceptedFiles[0]);
        setGenerating(true);
        updateLayer({
          id: activeLayer.id,
          url: objectUrl,
          width: 0,
          height: 0,
          name: "uploading",
          publicId: "",
          format: "",
          resourceType: "image",
        });
        setActiveLayer(activeLayer.id);

        const res = await uploadImage({ image: formData });
        if (res?.data?.success) {
          updateLayer({
            id: activeLayer.id,
            url: res.data.success.url,
            width: res.data.success.width,
            height: res.data.success.height,
            name: res.data.success.original_filename,
            publicId: res.data.success.public_id,
            format: res.data.success.format,
            resourceType: res.data.success.resource_type,
          });
        }
        setActiveLayer(activeLayer.id);
        setGenerating(false);

        if (res?.data?.error) {
          setGenerating(false);
        }
      }
    },
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "hover:curor-pointer hover:bg-secondary hover:border-primary transition-all ease-in-out",
        `${isDragActive ? "animate-pulse border-primary bg-secondary" : ""}`
      )}
    >
      <CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs">
        <input type="file" {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4">
          <h1>Upload Image</h1>
          <p className="text-muted-foreground text-2xl">
            {isDragActive
              ? "Drop the image here"
              : "Start by uploading an image"}
          </p>
          <p className="text-muted-foreground">
            Supported formats: .png, .jpg, .jpeg, .webp
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
