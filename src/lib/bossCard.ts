import { site } from "../config/site.ts";
import { fitCanvasLines, loadImage } from "./download.ts";

async function readyFonts(): Promise<void> {
  try {
    await document.fonts.load("700 68px 'Barlow Condensed'");
    await document.fonts.load("600 28px Outfit");
    await document.fonts.load("500 24px Outfit");
  } catch {
    // Canvas falls back to generic families if the webfonts are not ready.
  }
}

export async function renderBossCard(result: string): Promise<Blob> {
  const image = await loadImage(site.assets.logoPlain.png);
  await readyFonts();

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the boss card.");

  ctx.fillStyle = "#07111F";
  ctx.fillRect(0, 0, 1200, 1200);

  ctx.strokeStyle = "rgba(0, 220, 239, 0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(600, 560, 430, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(0, 220, 239, 0.7)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(600, 560, 360, 0, Math.PI * 2);
  ctx.stroke();

  const size = 640;
  ctx.drawImage(image, 600 - size / 2, 560 - size / 2, size, size);

  ctx.textAlign = "center";
  ctx.fillStyle = "#00DCEF";
  ctx.font = "600 28px Outfit, sans-serif";
  ctx.fillText("ELON'S FINAL BOSS  ·  $EFBOSS", 600, 96);

  ctx.font = "700 64px 'Barlow Condensed', 'Arial Narrow', sans-serif";
  ctx.fillStyle = "#F5F8FC";
  const lines = fitCanvasLines(ctx, result, 980, 2);
  lines.forEach((line, index) => {
    ctx.fillText(line, 600, 1008 + index * 70);
  });

  ctx.fillStyle = "#B4C3D2";
  ctx.font = "500 22px Outfit, sans-serif";
  ctx.fillText("A playful mini-game. Not a price signal or an AI test.", 600, 1140);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Could not create the PNG.");
  return blob;
}
