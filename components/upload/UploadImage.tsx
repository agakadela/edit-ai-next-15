import { uploadImage } from "@/server/upload-image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

const UploadImage = () => {
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
        console.log(formData);
        try {
          const res = await uploadImage({ image: formData });
          console.log(res);
        } catch (error) {
          console.log(error);
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
        <h1>Upload Image</h1>
        <p className="text-muted-foreground text-2xl">
          {isDragActive ? "Drop the image here" : "Start by uploading an image"}
        </p>
        <p className="text-muted-foreground">
          Supported formats: .png, .jpg, .jpeg, .webp
        </p>
      </CardContent>
    </Card>
  );
};

export default UploadImage;
