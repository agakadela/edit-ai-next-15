/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useImageStore } from "@/lib/image-store";
import { useLayerStore } from "@/lib/layer-store";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Image } from "lucide-react";
import { extractPart } from "@/server/extract-part";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function ExtractPart() {
  const setGenerating = useImageStore((state) => state.setGenerating);
  const generating = useImageStore((state) => state.generating);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const addLayer = useLayerStore((state) => state.addLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const [prompts, setPrompts] = useState<string[]>([]);
  const [multiple, setMultiple] = useState<boolean>(false);
  const [mode, setMode] = useState<"default" | "mask">("default");
  const [invert, setInvert] = useState<boolean>(false);

  const addPrompt = (prompt: string) => {
    setPrompts([...prompts, prompt]);
  };

  const updatePrompt = (index: number, prompt: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = prompt;
    setPrompts(newPrompts);
  };

  return (
    <Popover>
      <PopoverTrigger disabled={!activeLayer.url} asChild>
        <Button variant="outline" className="p-8">
          <span className="flex flex-col gap-1 items-center justify-center text-xs font-medium">
            Extract Part
            <Image size={16} />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div>
          <h3 className="text-sm font-medium">Extract Part</h3>
          <p className="text-xs text-muted-foreground">
            Extract part of an image with AI
          </p>
        </div>
        <div className="grid gap-2">
          {prompts.map((prompt, index) => (
            <div key={index}>
              <Label htmlFor={`prompt-${index}`}>Prompt {index + 1}</Label>
              <Input
                id={`prompt-${index}`}
                className="col-span-2 h-8"
                placeholder="Describe what to extract"
                value={prompt}
                onChange={(e) => updatePrompt(index, e.target.value)}
              />
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => addPrompt("")}>
            Add Prompt
          </Button>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="multiple"
              checked={multiple}
              onCheckedChange={(checked) => setMultiple(checked as boolean)}
            />
            <Label htmlFor="multiple">Extract multiple parts</Label>
          </div>
          <RadioGroup
            id="mode"
            value={mode}
            onValueChange={(value) => setMode(value as "default" | "mask")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default">Default (transparent background)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mask" id="mask" />
              <Label htmlFor="mask">Mask</Label>
            </div>
          </RadioGroup>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="invert"
              checked={invert}
              onCheckedChange={(checked) => setInvert(checked as boolean)}
            />
            <Label htmlFor="invert">Invert (keep background)</Label>
          </div>
        </div>

        <Button
          disabled={!activeLayer?.url || generating}
          className="w-full mt-4"
          onClick={async () => {
            const newLayerId = crypto.randomUUID();

            setGenerating(true);
            const res = await extractPart({
              format: activeLayer.format!,
              activeImage: activeLayer.url!,
              prompts: prompts.filter((prompt) => prompt.trim() !== ""),
              multiple,
              mode: mode as "default" | "mask",
              invert,
            });

            if (res?.data?.success) {
              addLayer({
                id: newLayerId,
                url: res.data.success,
                format: "png",
                publicId: activeLayer.publicId,
                height: activeLayer.height,
                width: activeLayer.width,
                name: "extracted-" + activeLayer.name,
                resourceType: "image",
              });

              setActiveLayer(newLayerId);
              setGenerating(false);

              if (res?.serverError) {
                setGenerating(false);
              }
            }
          }}
        >
          {generating ? "Extracting..." : "Extract Part"}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
