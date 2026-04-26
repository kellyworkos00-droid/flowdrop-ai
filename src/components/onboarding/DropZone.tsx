"use client";

import { useCallback } from "react";
import { Plus } from "lucide-react";
import { useDropzone } from "react-dropzone";

interface DropZoneProps {
  onDrop: (files: File[]) => void;
  onClick?: () => void;
}

export function DropZone({ onDrop, onClick }: DropZoneProps) {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    multiple: true,
  });

  return (
    <button
      type="button"
      {...getRootProps()}
      onClick={(event) => {
        onClick?.();
        event.currentTarget.focus();
      }}
      className={`w-full max-w-[460px] cursor-pointer rounded-[14px] border-2 border-dashed p-9 text-center transition-all duration-[220ms] ${
        isDragActive
          ? "border-[rgba(0,229,195,0.5)] bg-[rgba(0,229,195,0.03)]"
          : "border-[rgba(0,229,195,0.18)] bg-transparent"
      }`}
    >
      <input {...getInputProps()} />
      <Plus className="mx-auto mb-2 h-7 w-7 text-[#555A7A]" aria-hidden />
      <p className="text-[14px] text-[#8B90B8]">Drag anything here, or click to type your first drop</p>
      <p className="mt-1 text-[11px] text-[#555A7A]">Tasks · Ideas · Files · Links · Blockers · Notes</p>
    </button>
  );
}
