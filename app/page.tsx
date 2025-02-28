"use client";

import Editor from "@/components/editor";
import { ImageStore } from "@/lib/image-store";
import { LayerStore } from "@/lib/layer-store";

export default function Home() {
  return (
    <LayerStore.Provider
      initialValue={{
        layers: [
          {
            id: crypto.randomUUID(),
            name: "Layer 1",
            url: "https://picsum.photos/200/300",
            width: 200,
            height: 300,
            format: "png",
            resourceType: "image",
            poster: "https://picsum.photos/200/300",
            transcriptionURL: "https://picsum.photos/200/300",
          },
        ],
        layerComparisonMode: false,
      }}
    >
      <ImageStore.Provider initialValue={{ generating: false }}>
        <main className="h-full">
          <Editor />
        </main>
      </ImageStore.Provider>
    </LayerStore.Provider>
  );
}
