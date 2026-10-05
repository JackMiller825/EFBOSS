import { useEffect, useRef, useState } from "react";
import { site } from "../config/site.ts";
import type { ImageAsset } from "../config/site.ts";
import { downloadBlob, fitCanvasLines, loadImage } from "../lib/download.ts";

const MAX_CAPTION = 90;

const MEME_PRESETS = [
  "Your AI has encountered a small problem.",
  "Reflective vest. Unreasonable confidence.",
  "The scanner works. The cat disagrees.",
];

const MEME_IMAGES: Array<{ id: string; label: string; image: ImageAsset }> = [
  { id: "plain", label: "Scanner emblem", image: site.assets.logoPlain },
  { id: "wordmark", label: "Named emblem", image: site.assets.logoWordmark },
  { id: "wide", label: "Night road banner", image: site.assets.bannerWide },
  { id: "telegram", label: "Community banner", image: site.assets.bannerTelegram },
];

function memeLayout(aspect: number): { width: number; height: number; band: number } {
  if (aspect > 1.4) return { width: 1600, height: 1120, band: 340 };
  return { width: 1080, height: 1350, band: 340 };
}

async function drawMeme(canvas: HTMLCanvasElement, src: string, caption: string): Promise<void> {
  const image = await loadImage(src);
  try {
    await document.fonts.load("700 64px 'Barlow Condensed'");
    await document.fonts.load("600 24px Outfit");
  } catch {
    // Generic fallbacks still draw if a webfont is unavailable.
  }

  const layout = memeLayout(image.width / image.height);
  canvas.width = layout.width;
  canvas.height = layout.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the meme.");

  ctx.fillStyle = "#07111F";
  ctx.fillRect(0, 0, layout.width, layout.height);

  const boxW = layout.width - 80;
  const boxH = layout.height - layout.band - 64;
  const scale = Math.min(boxW / image.width, boxH / image.height);
  const dw = image.width * scale;
  const dh = image.height * scale;
  ctx.drawImage(image, (layout.width - dw) / 2, 40 + (boxH - dh) / 2, dw, dh);

  const bandTop = layout.height - layout.band;
  ctx.fillStyle = "#131D2A";
  ctx.fillRect(0, bandTop, layout.width, layout.band);
  ctx.fillStyle = "#00DCEF";
  ctx.fillRect(0, bandTop, layout.width, 4);

  ctx.textAlign = "center";
  ctx.fillStyle = "#00DCEF";
  ctx.font = "600 24px Outfit, sans-serif";
  ctx.fillText("ELON'S FINAL BOSS", layout.width / 2, bandTop + 52);

  const trimmed = caption.trim();
  if (trimmed) {
    ctx.fillStyle = "#F5F8FC";
    ctx.font = "700 60px 'Barlow Condensed', 'Arial Narrow', sans-serif";
    const lines = fitCanvasLines(ctx, trimmed, layout.width - 140, 3);
    lines.forEach((line, index) => {
      ctx.fillText(line, layout.width / 2, bandTop + 124 + index * 64);
    });
  }

  ctx.fillStyle = "#DFFF00";
  ctx.font = "700 32px 'Barlow Condensed', 'Arial Narrow', sans-serif";
  ctx.fillText(site.ticker, layout.width / 2, layout.height - 36);
}

export function MemeStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageId, setImageId] = useState(MEME_IMAGES[0]?.id ?? "plain");
  const [caption, setCaption] = useState(MEME_PRESETS[0] ?? "");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const selected = MEME_IMAGES.find((item) => item.id === imageId) ?? MEME_IMAGES[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selected) return;
    let canceled = false;
    setReady(false);
    drawMeme(canvas, selected.image.png, caption)
      .then(() => {
        if (!canceled) {
          setReady(true);
          setError("");
        }
      })
      .catch(() => {
        if (!canceled) {
          setReady(false);
          setError("The artwork couldn't be drawn. Check the brand files and try again.");
        }
      });
    return () => {
      canceled = true;
    };
  }, [caption, selected]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Couldn't create the PNG.");
        return;
      }
      downloadBlob(blob, "efboss-meme.png");
      setError("");
    }, "image/png");
  }

  function reset() {
    setImageId(MEME_IMAGES[0]?.id ?? "plain");
    setCaption(MEME_PRESETS[0] ?? "");
    setError("");
  }

  const preview = selected
    ? memeLayout(selected.image.width / selected.image.height)
    : { width: 1080, height: 1350, band: 340 };

  return (
    <div className="studio">
      <div className="studio-controls">
        <fieldset>
          <legend>Brand image</legend>
          <div className="choice-grid">
            {MEME_IMAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="choice"
                aria-pressed={item.id === imageId}
                onClick={() => setImageId(item.id)}
              >
                <img src={item.image.webp} alt="" width={item.image.width} height={item.image.height} />
                <span>{item.label}</span>
                <span className="choice-state">{item.id === imageId ? "Selected" : "Choose"}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div className="caption-field">
          <label htmlFor="meme-caption">Caption</label>
          <textarea
            id="meme-caption"
            maxLength={MAX_CAPTION}
            rows={3}
            value={caption}
            onChange={(event) => setCaption(event.target.value.replace(/[\r\n]+/g, " ").slice(0, MAX_CAPTION))}
          />
          <p className="char-count">
            {caption.length}/{MAX_CAPTION}
          </p>
        </div>
        <div className="preset-row" role="group" aria-label="Suggested captions">
          {MEME_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="chip"
              aria-pressed={caption === preset}
              onClick={() => setCaption(preset)}
            >
              {preset}
            </button>
          ))}
        </div>
        <div className="game-controls">
          <button type="button" className="btn btn-primary" onClick={download} disabled={!ready}>
            Download PNG
          </button>
          <button type="button" className="btn btn-secondary" onClick={reset}>
            Reset caption
          </button>
        </div>
        {error ? (
          <p className="card-note" role="alert">
            {error}
          </p>
        ) : (
          <p className="game-disclaimer">Nothing is uploaded or posted. The file stays on your device until you share it.</p>
        )}
      </div>
      <div className="studio-preview">
        <canvas
          ref={canvasRef}
          className="preview-canvas"
          width={preview.width}
          height={preview.height}
          style={{ aspectRatio: `${preview.width} / ${preview.height}` }}
          role="img"
          aria-label={caption.trim() ? `Meme preview: ${caption.trim()}` : "Meme preview"}
        />
        {!ready && !error ? (
          <p className="preview-status" role="status">
            Preparing preview…
          </p>
        ) : null}
      </div>
    </div>
  );
}
