/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useTransition } from "react";
import { Paperclip, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addAttachment } from "@/services/task/task.service";

interface TaskDetailAttachmentsTabProps {
  taskId: string;
  attachments: string[];
  fetchTaskDetails: () => Promise<void>;
}

export default function TaskDetailAttachmentsTab({
  taskId,
  attachments,
  fetchTaskDetails,
}: TaskDetailAttachmentsTabProps) {
  const [isPending, startTransition] = useTransition();
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const handleAddAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachmentFile || !taskId) return;

    const formData = new FormData();
    formData.append("file", attachmentFile);

    startTransition(async () => {
      try {
        const res = await addAttachment(taskId, formData);
        if (res?.success) {
          setAttachmentFile(null);
          // Reset file input value
          const fileInput = document.getElementById(
            "task-attachment-upload",
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";

          toast.success("Attachment uploaded!");
          fetchTaskDetails();
        } else {
          toast.error(res?.message || "Failed to upload attachment");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* File upload form */}
      <form
        onSubmit={handleAddAttachment}
        className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4"
      >
        <h6 className="text-xs font-bold text-zinc-300 uppercase tracking-wide flex items-center gap-1.5">
          <Paperclip className="h-4 w-4 text-indigo-400" />
          Upload File Attachment
        </h6>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            id="task-attachment-upload"
            onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
            className="w-full bg-zinc-900/30 border border-zinc-800 text-zinc-300 text-xs rounded-xl p-2 cursor-pointer focus:outline-hidden focus:border-zinc-700"
            required
          />
          <span className="text-[9px] text-zinc-500">
            PNG, JPG, PDF, DOCX (Max 10MB)
          </span>
        </div>
        <Button
          type="submit"
          disabled={isPending || !attachmentFile}
          className="w-full bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold h-9 rounded-xl cursor-pointer"
        >
          Upload File
        </Button>
      </form>

      {/* Attachments List */}
      {attachments?.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 flex flex-col items-center">
          <Paperclip className="h-7 w-7 mb-2 text-zinc-700" />
          <span className="text-xs font-semibold">No file assets</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">
            Drag-and-drop or select files to link with this task.
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          {attachments?.map((url: string, index: number) => {
            const filename = url.substring(url.lastIndexOf("/") + 1);
            return (
              <Link
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 transition-all text-xs text-zinc-300"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-70 font-semibold">
                    {filename}
                  </span>
                </div>
                <span className="text-[9px] text-indigo-400 font-extrabold uppercase shrink-0 hover:underline">
                  View
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
