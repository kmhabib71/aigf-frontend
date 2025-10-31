"use client";

import React, { useEffect, useRef, useState } from "react";

// Minimal ICO wrapper: embeds a single 256x256 PNG inside an .ico container
function wrapPngAsIco(pngBytes: Uint8Array): Uint8Array {
  // ICONDIR (6 bytes) + ICONDIRENTRY (16 bytes) + PNG data
  const ICONDIR_SIZE = 6;
  const ICONDIRENTRY_SIZE = 16;
  const total = ICONDIR_SIZE + ICONDIRENTRY_SIZE + pngBytes.byteLength;
  const buf = new ArrayBuffer(total);
  const view = new DataView(buf);
  let off = 0;
  // ICONDIR
  view.setUint16(off, 0, true); off += 2;          // reserved
  view.setUint16(off, 1, true); off += 2;          // type: 1 = icon
  view.setUint16(off, 1, true); off += 2;          // count: 1 image
  // ICONDIRENTRY
  const width = 256; const height = 256;           // we generate 512 source but export 256 canvas for ICO
  view.setUint8(off++, width === 256 ? 0 : width); // bWidth (0 means 256)
  view.setUint8(off++, height === 256 ? 0 : height); // bHeight
  view.setUint8(off++, 0);                         // bColorCount
  view.setUint8(off++, 0);                         // bReserved
  view.setUint16(off, 1, true); off += 2;          // wPlanes
  view.setUint16(off, 32, true); off += 2;         // wBitCount
  view.setUint32(off, pngBytes.byteLength, true); off += 4; // dwBytesInRes
  view.setUint32(off, ICONDIR_SIZE + ICONDIRENTRY_SIZE, true); off += 4; // dwImageOffset
  // PNG data
  new Uint8Array(buf, off).set(pngBytes);
  return new Uint8Array(buf);
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function IconMakerPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState<number>(0.84); // portion of tile filled by logo (0-1)

  const draw = async () => {
    setError(null);
    const s = 512; // high-res canvas for PNG output
    const c = canvasRef.current!;
    c.width = s; c.height = s;
    const ctx = c.getContext("2d");
    if (!ctx) { setError("Canvas not supported"); return; }

    // Background rounded square (glass chip)
    const r = 96;
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(s, 0, s, s, r);
    ctx.arcTo(s, s, 0, s, r);
    ctx.arcTo(0, s, 0, 0, r);
    ctx.arcTo(0, 0, s, 0, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Soft inner shadow / vignette
    const grd = ctx.createRadialGradient(s * 0.5, s * 0.3, 0, s * 0.5, s * 0.3, s * 0.8);
    grd.addColorStop(0, "rgba(0,0,0,0.12)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, s, s);

    // Centered logo
    const logo = await loadImage("/logo.png");
    // Draw the logo larger by reducing padding (controlled by logoScale)
    const w = s * logoScale;
    const h = w;
    ctx.drawImage(logo, (s - w) / 2, (s - h) / 2, w, h);
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoScale]);

  const downloadPng = async () => {
    try {
      setBusy(true);
      const c = canvasRef.current!;
      const blob = await new Promise<Blob | null>((resolve) => c.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("PNG export failed");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "logo-ico-512.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const downloadIco = async () => {
    try {
      setBusy(true);
      // Downscale to 256x256 for ICO best-compat
      const src = canvasRef.current!;
      const t = document.createElement("canvas");
      t.width = 256; t.height = 256;
      const tctx = t.getContext("2d")!;
      tctx.drawImage(src, 0, 0, 256, 256);
      const pngBlob = await new Promise<Blob | null>((resolve) => t.toBlob(resolve, "image/png"));
      if (!pngBlob) throw new Error("ICO PNG step failed");
      const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
      const icoBytes = wrapPngAsIco(pngBytes);
      const icoBlob = new Blob([icoBytes], { type: "image/x-icon" });
      const url = URL.createObjectURL(icoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "logo-ico.ico";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 p-6">
      <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-xl border border-purple-200/40 rounded-3xl shadow-2xl p-6">
        <h1 className="text-2xl font-extrabold mb-2">Logo Icon Maker</h1>
        <p className="text-sm text-gray-600 mb-4">Generates a rounded "chip" icon around /logo.png and lets you download PNG or ICO.</p>
        <div className="flex items-center justify-center mb-4">
          <canvas ref={canvasRef} className="w-48 h-48 border border-gray-200 rounded-2xl shadow" />
        </div>
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo size
            <span className="ml-2 text-gray-500">{Math.round(logoScale * 100)}%</span>
          </label>
          <input
            type="range"
            min={0.6}
            max={0.95}
            step={0.01}
            value={logoScale}
            onChange={(e) => setLogoScale(parseFloat(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={downloadPng} disabled={busy} className="px-4 py-2 bg-purple-600 text-white rounded-xl disabled:opacity-50">Download PNG</button>
          <button onClick={downloadIco} disabled={busy} className="px-4 py-2 bg-pink-600 text-white rounded-xl disabled:opacity-50">Download ICO</button>
          <button onClick={draw} disabled={busy} className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50">Redraw</button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
