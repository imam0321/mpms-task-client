/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useTransition } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { formatDate } from "@/lib/formatDate";
import { addComment, deleteComment } from "@/services/task/task.service";
import { IUser } from "@/types/api.types";

interface TaskDetailCommentsTabProps {
  taskId: string;
  comments: any[];
  currentUser: IUser;
  fetchTaskDetails: () => Promise<void>;
}

export default function TaskDetailCommentsTab({
  taskId,
  comments,
  currentUser,
  fetchTaskDetails,
}: TaskDetailCommentsTabProps) {
  const [isPending, startTransition] = useTransition();
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !taskId) return;

    startTransition(async () => {
      try {
        const res = await addComment(taskId, { comment: newComment.trim() });
        if (res?.success) {
          setNewComment("");
          toast.success("Comment added!");
          fetchTaskDetails();
        } else {
          toast.error(res?.message || "Failed to add comment");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    startTransition(async () => {
      try {
        const res = await deleteComment(commentId);
        if (res?.success) {
          toast.success("Comment deleted successfully!");
          fetchTaskDetails();
        } else {
          toast.error(res?.message || "Failed to delete comment");
        }
      } catch (err: any) {
        toast.error(err?.message || "An error occurred");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Add comment box */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <Input
          type="text"
          placeholder="Share updates or ask a question..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-zinc-900/40 border-zinc-800 text-zinc-200 focus:border-zinc-700 rounded-xl h-9"
        />
        <Button
          type="submit"
          disabled={isPending || !newComment.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold h-9 rounded-xl px-4 cursor-pointer"
        >
          Post
        </Button>
      </form>

      {/* Comments feed */}
      {comments?.length === 0 ? (
        <div className="text-center py-8 text-zinc-600 flex flex-col items-center">
          <MessageSquare className="h-7 w-7 mb-2 text-zinc-700" />
          <span className="text-xs font-semibold">No discussions yet</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">
            Start the conversation by posting an update.
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {comments?.map((c: any) => (
            <div
              key={c._id}
              className="flex gap-3 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:bg-zinc-950/40 transition-all"
            >
              {c.author?.profileImg ? (
                <Image
                  height={32}
                  width={32}
                  src={c.author.profileImg}
                  alt={c.author.name}
                  className="h-8 w-8 rounded-full object-cover border border-zinc-800 shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold border border-zinc-700/50 text-zinc-300 shrink-0">
                  {c.author?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-200">
                      {c.author?.name}
                    </span>
                    <span className="text-[9px] text-zinc-500">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  {(c.author?._id === currentUser?._id ||
                    currentUser?.role === "Admin" ||
                    currentUser?.role === "Manager") && (
                    <button
                      onClick={() => handleDeleteComment(c._id)}
                      disabled={isPending}
                      className="text-zinc-500 hover:text-rose-400 p-1 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide block mb-1">
                  {c.author?.role}
                </span>
                <p className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {c.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
