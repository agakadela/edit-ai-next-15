"use client";
import { Layer } from "@/lib/layer-store";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

export default function ImageComparison({ layers }: { layers: Layer[] }) {
  if (layers.length === 0) {
    return <div> No layers to compare</div>;
  }

  if (layers.length === 1) {
    return (
      <div className="h-full">
        <ReactCompareSliderImage
          src={layers[0].url}
          srcSet={layers[0].url}
          alt={layers[0].name}
          className="rounded-lg object-contain"
        />
      </div>
    );
  }

  return (
    <ReactCompareSlider
      itemOne={
        <ReactCompareSliderImage
          src={layers[0].url}
          srcSet={layers[0].url}
          alt={layers[0].name}
        />
      }
      itemTwo={
        <ReactCompareSliderImage
          src={layers[1].url}
          srcSet={layers[1].url}
          alt={layers[1].name}
        />
      }
    />
  );
}
