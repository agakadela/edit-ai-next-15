import BgRemove from "./bg-remove";
import BgReplace from "./bg-replace";
import GenRemove from "./gen-remove";

export default function ImageToolbar() {
  return (
    <>
      <GenRemove />
      <BgRemove />
      <BgReplace />
    </>
  );
}
