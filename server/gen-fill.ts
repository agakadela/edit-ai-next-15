"use server";

import { checkProcessing } from "@/lib/check-processing";
import { actionClient } from "@/lib/safe-action";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const genFillSchema = z.object({
  activeImage: z.string(),
  aspectRatio: z.string(),
  width: z.string(),
  height: z.string(),
});

export const genFill = actionClient
  .schema(genFillSchema)
  .action(
    async ({ parsedInput: { activeImage, aspectRatio, width, height } }) => {
      const form = activeImage.split("/upload/");
      const genFillUrl = `${form[0]}/upload/ar_${aspectRatio},b_gen_fill,c_pad,w_${width},h_${height}/${form[1]}`;

      let isProcessed = false;
      const maxAttempts = 20;
      const delay = 500;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        isProcessed = await checkProcessing(genFillUrl);
        if (isProcessed) break;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      if (!isProcessed) {
        throw new Error("Failed to process image");
      }

      return { success: genFillUrl };
    }
  );
