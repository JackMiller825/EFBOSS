import { useState } from "react";
import { site } from "../config/site.ts";
import { contractAddressText } from "../config/selectors.ts";
import { copyText } from "../lib/copyText.ts";

interface CopyAddressButtonProps {}

export function CopyAddressButton() {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function onCopy() {
    const ok = await copyText(contractAddressText(site));
    setState(ok ? "copied" : "error");
    window.setTimeout(() => setState("idle"), 2000);
  }

  const label = state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy address";

  return (
    <>
      <button type="button" className="btn btn-secondary btn-copy" onClick={onCopy}>
        {label}
      </button>
      <span className="sr-only" role="status">
        {state === "copied" ? "Contract address copied." : ""}
        {state === "error" ? "Couldn't copy the contract address. Select it and copy it manually." : ""}
      </span>
    </>
  );
}
