"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * Share component
 * - Displays a QR code that points to the current page URL (or a provided value)
 * - Handy actions: Share (Web Share API), Copy link, Download PNG
 * - Uses your globals.css classes: .card, .btn, .btn-gradient, .btn-inverted
 */

export type ShareProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  /** If not provided, we use window.location.href on mount */
  value?: string;
  /** QR code size in pixels */
  size?: number; // default 220
  /** Add a CTA button to open the link (useful on desktop for preview) */
  showOpen?: boolean;
};

export default function Share({
  id = "share",
  title = "Share this page",
  subtitle = "Scan the QR code or use the buttons below to share.",
  value,
  size = 220,
  showOpen = false,
}: ShareProps) {
  const [url, setUrl] = useState<string>(value ?? "");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Resolve URL on client if not provided via props
  useEffect(() => {
    if (!value && typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, [value]);

  const filename = useMemo(() => {
    try {
      const u = new URL(url || "http://example.com");
      return `qr-${(u.hostname + u.pathname).replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "page"}.png`;
    } catch {
      return "qr-share.png";
    }
  }, [url]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    } catch (e) {
      console.error(e);
      alert("Could not copy. Please copy manually.");
    }
  };

  const onDownload = () => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section id={id} className="section bg-gradient-2-top">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8 text-center">
          <span className="h-eyebrow inline-block">Share</span>
          <h2 className="h-display mt-2">{title}</h2>
          {subtitle && (
            <p className="mt-3 h-hero-p opacity-80 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </header>

        <div className="grid gap-2 sm:grid-cols-2 items-center">
          <div className="card p-6 sm:p-8 text-center">
            {/* The QRCodeCanvas renders a <canvas>; capture it for download */}
            <div className="flex items-center justify-center">
              <QRCodeCanvas
                value={url || ""}
                size={size}
                includeMargin
                level="M"
                ref={canvasRef}
              />
            </div>
            <div className="mt-4 text-sm opacity-80 break-words">
              {url || ""}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6">
              {/* <h3 className="text-xl font-semibold">Quick actions</h3> */}
              <div className=" flex justify-center flex-wrap gap-3">
                <button onClick={onCopy} className="btn btn-gradient">Copy Link</button>
                <button onClick={onDownload} className="btn btn-inverted">Download PNG</button>
                {showOpen && (
                  <a href={url} target="_blank" rel="noreferrer" className="btn btn-inverted">
                    Open Link
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
