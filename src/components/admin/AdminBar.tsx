'use client';

import { useState } from 'react';
import MediaPicker from './MediaPicker';

export default function AdminBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed right-4 top-4 z-[1000]">
        <div className="card px-4 py-3 flex items-center gap-3">
          <span className="font-semibold">Admin Mode</span>
          <button className="btn btn-primary" onClick={() => setOpen(true)}>Open Media Picker</button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[1100] bg-black/50 flex items-center justify-center p-4">
          <div className="card p-4 relative w-fit !max-w-full pr-[70px]">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 btn btn-ghost"
              aria-label="Close"
            >
              ✕
            </button>
            {/* You can pass any prefix/bucket here. For now, demo with configs/carole/assets/ */}
            <MediaPicker
              bucket={process.env.NEXT_PUBLIC_S3_DEFAULT_BUCKET}
              prefix="configs/carole/assets/"
              onPick={(key) => {
                // For now we just log; later wire into your form field
                console.log('Picked media key:', key);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
