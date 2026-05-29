import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface FileUploadOptions {
  accept?: string;
  maxSize?: number;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
}

export function useFileUpload({ accept, maxSize }: FileUploadOptions = {}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File): boolean => {
    setErrors([]);
    
    // Validate file size
    if (maxSize && file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      setErrors([`File size exceeds the limit of ${sizeMB}MB`]);
      return false;
    }

    // Validate type if accept is set (e.g. image/*)
    if (accept) {
      const mimeTypePattern = new RegExp(accept.replace("*", ".*"));
      if (!mimeTypePattern.test(file.type)) {
        setErrors([`Invalid file type. Only ${accept} is allowed.`]);
        return false;
      }
    }

    return true;
  };

  const addFile = (file: File) => {
    if (!validateFile(file)) return;
    
    // Revoke previous previews if any
    files.forEach((f) => URL.revokeObjectURL(f.preview));

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
    };
    setFiles([newFile]);
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find((f) => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles([]);
    setErrors([]);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      addFile(droppedFiles[0]);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      addFile(selectedFiles[0]);
    }
  };

  const getInputProps = () => ({
    type: "file",
    accept,
    ref: (el: HTMLInputElement | null) => {
      fileInputRef.current = el;
    },
    onChange: handleInputChange,
  });

  return [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] as const;
}
