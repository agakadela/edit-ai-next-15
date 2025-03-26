import BgRemove from "./bg-remove";
import BgReplace from "./bg-replace";
import ExtractPart from "./extract-part";
import GenRemove from "./gen-remove";
import GenerativeFill from "./generative-fill";
export default function ImageToolbar() {
  return (
    <>
      <GenRemove />
      <BgRemove />
      <BgReplace />
      <GenerativeFill />
      <ExtractPart />
    </>
  );
}
