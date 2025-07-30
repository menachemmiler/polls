import { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { axiosInstance } from "../axios";
import { environment } from "../globals";

interface UploadMediaProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setUploadedUrl: (url: string | null) => void;
}

export default function AddImage({
  isOpen,
  setIsOpen,
  setUploadedUrl,
}: UploadMediaProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 300, height: 300 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isVideo, setIsVideo] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState(300);
  const imgRef = useRef<HTMLImageElement>(null);

  const maxMB = 90;
  const maxW = 599;
  const maxH = 745;
  const minW = 100;

  const resetFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setSize({ width: 300, height: 300 });
    setAspectRatio(1);
    setIsVideo(false);
    setNaturalWidth(300);
  };

  const handleFile = (selected: File) => {
    if (file) return;
    if (selected.size > maxMB * 1024 * 1024) {
      alert(`⚠️ הקובץ גדול מדי (מעל ${maxMB}MB).`);
      return;
    }

    const url = URL.createObjectURL(selected);
    setFile(selected);
    setPreviewUrl(url);
    setUploadedUrl(null);
    const isVid = selected.type.startsWith("video/");
    setIsVideo(isVid);

    if (isVid) {
      const video = document.createElement("video");
      video.onloadedmetadata = () => {
        const w = video.videoWidth;
        const h = video.videoHeight;
        const ratio = w / h || 1;
        const scale = Math.min(maxW / w, maxH / h, 1);
        const scaledW = w * scale;
        const scaledH = h * scale;
        setAspectRatio(ratio);
        setNaturalWidth(w);
        setSize({ width: scaledW, height: scaledH });
      };
      video.src = url;
    } else {
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;
        const ratio = w / h;
        const scale = Math.min(maxW / w, maxH / h, 1);
        const scaledW = w * scale;
        const scaledH = h * scale;
        setAspectRatio(ratio);
        setNaturalWidth(w);
        setSize({ width: scaledW, height: scaledH });
      };
      img.src = url;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.files?.[0] && handleFile(e.target.files[0]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();

    if (!isVideo && previewUrl && imgRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(imgRef.current, 0, 0, size.width, size.height);
      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, "image/png")
      );
      if (!blob) return;
      form.append("file", new File([blob], file.name, { type: "image/png" }));
    } else {
      form.append("file", file);
    }

    try {
      const res = await axiosInstance.post(
        `${environment.env.backend_url}/api/upload`,
        form
      );
      setUploadedUrl(res.data.url);
      resetFile();
      setIsOpen(false);
    } catch (err) {
      console.error("❌ שגיאה:", err);
    }
  };

  const sliderMaxWidth = Math.min(naturalWidth, maxW, maxH * aspectRatio);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <Dialog.Panel className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 left-3 text-gray-500 hover:text-red-500"
        >
          <X />
        </button>

        <Dialog.Title className="text-lg font-semibold text-center mb-4">
          העלאת מדיה
        </Dialog.Title>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative border border-dashed border-gray-400 rounded-md p-4 text-center min-h-[150px]"
        >
          {!previewUrl ? (
            <>
              <p className="text-sm text-gray-600 mb-2">ניתן לגרור קובץ לכאן</p>
              <input
                id="media-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleInput}
                className="hidden"
                disabled={!!file}
              />
              <label
                htmlFor="media-upload"
                className="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer text-sm text-gray-700 hover:bg-gray-200 transition"
              >
                בחירת קובץ
              </label>
            </>
          ) : (
            <div
              style={{ width: size.width, height: size.height }}
              className="relative mx-auto mt-2"
            >
              <button
                onClick={resetFile}
                className="absolute top-1 left-1 bg-white/80 hover:bg-white  text-black p-1 rounded-full z-10"
              >
                <X size={14} />
              </button>
              {!isVideo ? (
                <img
                  ref={imgRef}
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-contain rounded-md"
                />
              )}
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <input
              type="range"
              min={minW}
              max={sliderMaxWidth}
              value={size.width}
              onChange={(e) =>
                setSize({
                  width: +e.target.value,
                  height: +e.target.value / aspectRatio,
                })
              }
              className="w-full accent-purple-600 transition-all duration-200"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file}
          className="w-full mt-6 py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
        >
          שלח
        </button>
      </Dialog.Panel>
    </Dialog>
  );
}
