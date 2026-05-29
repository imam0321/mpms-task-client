/* eslint-disable react-hooks/exhaustive-deps */
import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useEffect, useRef, useState } from "react";

interface SingleImageUploaderProps {
  onChange: (file: File | null) => void; // strictly File or null
  preview?: string | null;
  name?: string;
}

export default function SingleImageUploader({
  onChange,
  preview,
  name = "thumbnail",
}: SingleImageUploaderProps) {
  const maxSizeMB = 5;
  const maxSize = maxSizeMB * 1024 * 1024;

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [previewRemoved, setPreviewRemoved] = useState(false);

  const [
    { files, isDragging, errors },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, removeFile, getInputProps },
  ] = useFileUpload({ accept: "image/*", maxSize });

  // update parent & hidden input whenever files change
  useEffect(() => {
    const file = files[0]?.file instanceof File ? files[0].file : null;
    onChange(file);
    setPreviewRemoved(false);

    if (hiddenInputRef.current) {
      const dt = new DataTransfer();
      if (file) dt.items.add(file);
      hiddenInputRef.current.files = dt.files;
    }
  }, [files]);

  const handleRemove = () => {
    if (files[0]?.id) removeFile(files[0].id);
    setPreviewRemoved(true);
    onChange(null);

    if (hiddenInputRef.current) hiddenInputRef.current.value = "";
  };

  // Preview: new file or old URL if not removed
  const previewUrl = files[0]?.preview || (!previewRemoved ? preview : null);
  const inputProps = getInputProps();

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop area */}
        <div
          role="button"
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors"
        >
          {/* Invisible drop/input */}
          <input {...inputProps} className="sr-only" aria-label="Upload file" />

          {/* Hidden input for form submit */}
          <input ref={hiddenInputRef} type="file" name={name} accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" />

          {previewUrl ? (
            <img src={previewUrl} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div className="bg-background mb-2 flex h-11 w-11 items-center justify-center rounded-full border">
                <ImageUpIcon className="h-4 w-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">Drop your image here or click to browse</p>
              <p className="text-muted-foreground text-xs">Max size: {maxSizeMB}MB</p>
            </div>
          )}
        </div>

        {previewUrl && (
          <button
            type="button"
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 z-50"
            onClick={handleRemove}
            aria-label="Remove image"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="h-3 w-3" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
