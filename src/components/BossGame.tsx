import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { site } from "../config/site.ts";
import { useMediaQuery, useOnScreen } from "../hooks/useMedia.ts";
import { renderBossCard } from "../lib/bossCard.ts";
import { downloadBlob } from "../lib/download.ts";
import { BrandImage } from "./BrandImage.tsx";

const RESULTS = [
  "Boss detected. Confidence unaffected.",
  "Target identified. Threat level: extremely small.",
  "Scan complete. The vest was reflective. The attitude was not.",
];

const SLOTS = [
  { x: 30, y: 63 },
  { x: 52, y: 68 },
  { x: 72, y: 61 },
  { x: 40, y: 72 },
];

const TOTAL_MS = 5400;
const TRAVEL_MS = 1800;
const LOCK_MS = 3200;
const DODGE_MS = 4300;

type Phase = "idle" | "scanning" | "locked" | "dodging" | "done";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

export function BossGame() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const kittenElRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const scannerRef = useRef({ x: 28, y: 38 });
  const runningRef = useRef(false);
  const rafRef = useRef(0);
  const elapsedRef = useRef(0);
  const lastRef = useRef(0);
  const resultIndex = useRef(0);
  const slotIndex = useRef(2);

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const visible = useOnScreen(stageRef, 0.2);
  const reducedRef = useRef(reduced);
  const visibleRef = useRef(visible);

  useEffect(() => {
    reducedRef.current = reduced;
    visibleRef.current = visible;
  });

  const [slot, setSlot] = useState(SLOTS[2] ?? SLOTS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [cardNote, setCardNote] = useState("");
  const [canShare] = useState(
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
  );

  useEffect(() => {
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function paint(x: number, y: number) {
    scannerRef.current = { x, y };
    const reticle = reticleRef.current;
    if (!reticle) return;
    reticle.style.left = `${x}%`;
    reticle.style.top = `${y}%`;
  }

  function setProgress(amount: number) {
    const bar = progressRef.current;
    if (!bar) return;
    bar.style.transform = `scaleX(${clamp(amount, 0, 1)})`;
  }

  function overlapsKitten(): boolean {
    const kitten = kittenElRef.current;
    const stage = stageRef.current;
    if (!kitten || !stage) return false;
    const box = kitten.getBoundingClientRect();
    const rect = stage.getBoundingClientRect();
    const point = scannerRef.current;
    const x = rect.left + (point.x / 100) * rect.width;
    const y = rect.top + (point.y / 100) * rect.height;
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    return Math.hypot(x - cx, y - cy) < box.width * 0.42;
  }

  function finish(line: string) {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    setProgress(1);
    paint(slot.x, slot.y);
    setPhase("done");
    setResult(line);
    setLive(line);
  }

  function startScan() {
    if (runningRef.current || phase === "done") return;
    const line = RESULTS[resultIndex.current % RESULTS.length] ?? RESULTS[0];
    resultIndex.current += 1;
    const kitten = slot;
    const origin = { ...scannerRef.current };
    const alreadyThere = Math.hypot(origin.x - kitten.x, origin.y - kitten.y) < 8;

    if (reducedRef.current) {
      finish(line);
      return;
    }

    runningRef.current = true;
    elapsedRef.current = 0;
    lastRef.current = 0;
    setPhase("scanning");
    setLive("Scanning the road. This takes a few seconds.");
    setProgress(0);

    const frame = (now: number) => {
      if (!runningRef.current) return;
      if (reducedRef.current) {
        finish(line);
        return;
      }
      if (!visibleRef.current) {
        lastRef.current = 0;
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      if (!lastRef.current) lastRef.current = now;
      elapsedRef.current += now - lastRef.current;
      lastRef.current = now;
      const t = elapsedRef.current;
      setProgress(t / TOTAL_MS);

      if (t < TRAVEL_MS) {
        if (alreadyThere) {
          const angle = (t / TRAVEL_MS) * Math.PI * 2;
          paint(
            clamp(kitten.x + Math.cos(angle) * 12, 8, 92),
            clamp(kitten.y + Math.sin(angle) * 8, 16, 86),
          );
        } else {
          const u = ease(Math.min(1, t / TRAVEL_MS));
          paint(origin.x + (kitten.x - origin.x) * u, origin.y + (kitten.y - origin.y) * u);
        }
        setPhase("scanning");
      } else if (t < LOCK_MS) {
        paint(kitten.x, kitten.y);
        setPhase("locked");
      } else if (t < DODGE_MS) {
        paint(kitten.x, kitten.y);
        setPhase("dodging");
      } else if (t < TOTAL_MS) {
        paint(kitten.x, kitten.y);
        setPhase("dodging");
      } else {
        finish(line);
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
  }

  function reset() {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
    let next = Math.floor(Math.random() * SLOTS.length);
    if (next === slotIndex.current) next = (next + 1) % SLOTS.length;
    slotIndex.current = next;
    const nextSlot = SLOTS[next] ?? SLOTS[0];
    setSlot(nextSlot);
    setPhase("idle");
    setResult(null);
    setLive("");
    setProgress(0);
    const away = nextSlot.x > 50 ? 24 : 76;
    paint(away, 36);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
    if (runningRef.current || phase === "done") return;
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    paint(
      clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
      clamp(((event.clientY - rect.top) / rect.height) * 100, 14, 88),
    );
    if (overlapsKitten()) startScan();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Enter" || event.key === " ") {
      startScan();
      return;
    }
    if (runningRef.current || phase === "done") return;
    const next = { ...scannerRef.current };
    if (event.key === "ArrowUp") next.y -= 6;
    if (event.key === "ArrowDown") next.y += 6;
    if (event.key === "ArrowLeft") next.x -= 6;
    if (event.key === "ArrowRight") next.x += 6;
    paint(clamp(next.x, 8, 92), clamp(next.y, 14, 88));
    if (overlapsKitten()) startScan();
  }

  async function onDownload() {
    try {
      const blob = await renderBossCard(result ?? RESULTS[0]);
      downloadBlob(blob, "efboss-boss-card.png");
      setCardNote("Boss card downloaded. Post it only if you choose to.");
    } catch {
      setCardNote("Couldn't create the card. Try the download again.");
    }
  }

  async function onShare() {
    try {
      const blob = await renderBossCard(result ?? RESULTS[0]);
      const file = new File([blob], "efboss-boss-card.png", { type: "image/png" });
      if (!navigator.canShare?.({ files: [file] })) {
        setCardNote("Sharing isn't available in this browser. Download the card and post it yourself.");
        return;
      }
      await navigator.share({
        files: [file],
        title: `${site.name} (${site.ticker})`,
        text: result ?? RESULTS[0],
      });
      setCardNote("Share sheet opened. Nothing is posted until you confirm it.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setCardNote("Share canceled. Nothing was posted.");
        return;
      }
      setCardNote("Couldn't open sharing. Download the card instead.");
    }
  }

  const dodging = phase === "dodging" || phase === "done";
  const dodgeClass = slot.x >= 50 ? "dodge-left" : "dodge-right";
  const status =
    phase === "scanning"
      ? "Scanning the road…"
      : phase === "locked"
        ? "Signal lock"
        : phase === "dodging"
          ? "The boss stepped aside"
          : phase === "done"
            ? result
            : "Scanner idle";

  return (
    <div className="game">
      <div
        ref={stageRef}
        className={`stage${visible ? "" : " is-paused"}${phase === "scanning" || phase === "locked" ? " is-scanning" : ""}`}
        tabIndex={0}
        role="group"
        aria-label="Scanner scene"
        aria-describedby="game-help"
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
      >
        <SceneArt />
        <div
          ref={kittenElRef}
          className={`kitten${phase === "locked" || dodging ? " is-hit" : ""}${dodging && !reduced ? ` is-dodging ${dodgeClass}` : ""}`}
          style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
        >
          <BrandImage
            image={site.assets.logoPlain}
            alt="Grey kitten in a reflective vest, the target of the scanner."
          />
        </div>
        <div ref={reticleRef} className="reticle" style={{ left: "28%", top: "38%" }} aria-hidden="true" />
        <p className="stage-status" aria-hidden="true">
          {status}
        </p>
        <div className="scan-progress" aria-hidden="true">
          <span ref={progressRef} />
        </div>
      </div>
      <p id="game-help" className="game-help">
        On a keyboard, focus the scene, move with the arrow keys, and press Enter to scan. On a
        small screen, use Scan for kitten. Reduced motion skips the chase and shows the result.
      </p>
      <div className="game-controls">
        <button type="button" className="btn btn-primary" onClick={startScan} disabled={phase !== "idle"}>
          Scan for kitten
        </button>
        {phase === "done" ? (
          <button type="button" className="btn btn-secondary" onClick={reset}>
            Try again
          </button>
        ) : null}
        <button type="button" className="btn btn-secondary" onClick={onDownload}>
          Download boss card
        </button>
        {canShare ? (
          <button type="button" className="btn btn-quiet" onClick={onShare}>
            Share card…
          </button>
        ) : null}
      </div>
      {result ? (
        <p className="result-line" aria-hidden="true">
          {result}
        </p>
      ) : null}
      <p className="sr-only" role="status">
        {live}
      </p>
      <p className="card-note" role="status">
        {cardNote}
      </p>
      <p className="game-disclaimer">
        Results are a joke. They do not measure investment potential or real AI performance.
      </p>
    </div>
  );
}

function SceneArt() {
  return (
    <svg className="scene-bg" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#07111F" />
          <stop offset="48%" stopColor="#10283C" />
          <stop offset="100%" stopColor="#07111F" />
        </linearGradient>
      </defs>
      <rect width="1000" height="640" fill="url(#night)" />
      <g fill="#F5F8FC">
        <circle cx="80" cy="54" r="1.4" />
        <circle cx="180" cy="90" r="1" />
        <circle cx="260" cy="40" r="1.2" />
        <circle cx="420" cy="70" r="1" />
        <circle cx="610" cy="36" r="1.3" />
        <circle cx="760" cy="84" r="1" />
        <circle cx="900" cy="48" r="1.2" />
      </g>
      <g opacity="0.95">
        <rect x="40" y="210" width="70" height="150" fill="#0C1A28" />
        <rect x="130" y="160" width="90" height="200" fill="#102233" />
        <rect x="240" y="190" width="54" height="170" fill="#0C1A28" />
        <rect x="720" y="150" width="80" height="210" fill="#102233" />
        <rect x="820" y="200" width="60" height="160" fill="#0C1A28" />
        <rect x="900" y="170" width="70" height="190" fill="#102233" />
      </g>
      <g fill="#00DCEF">
        <rect x="54" y="228" width="6" height="8" />
        <rect x="70" y="250" width="6" height="8" />
        <rect x="148" y="180" width="6" height="8" />
        <rect x="168" y="210" width="6" height="8" />
        <rect x="740" y="176" width="6" height="8" />
        <rect x="764" y="210" width="6" height="8" />
        <rect x="918" y="196" width="6" height="8" />
      </g>
      <g fill="#DFFF00">
        <rect x="186" y="240" width="6" height="8" />
        <rect x="252" y="214" width="6" height="8" />
        <rect x="836" y="230" width="6" height="8" />
      </g>
      <circle cx="500" cy="250" r="120" fill="none" stroke="rgba(0,220,239,0.25)" strokeWidth="8" />
      <circle cx="500" cy="250" r="168" fill="none" stroke="rgba(0,220,239,0.18)" strokeWidth="3" strokeDasharray="10 14" />
      <polygon points="80,360 920,360 1000,640 0,640" fill="#101A26" />
      <polygon points="390,360 610,360 760,640 240,640" fill="#182433" />
      <path d="M80 360 H920" stroke="#00DCEF" strokeWidth="3" />
      <path d="M180 392 H820" stroke="#DFFF00" strokeWidth="3" opacity="0.8" />
      <g fill="#F5F8FC">
        <rect x="492" y="390" width="16" height="28" />
        <rect x="492" y="440" width="16" height="28" />
        <rect x="492" y="490" width="16" height="28" />
        <rect x="492" y="540" width="16" height="28" />
        <rect x="492" y="590" width="16" height="28" />
      </g>
    </svg>
  );
}
