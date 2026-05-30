"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

type ConfirmDialogProps = {
  open?: boolean;
  isOpen?: boolean;
  
  setOpen?: (val: boolean) => void;
  onClose?: () => void;

  title: string;
  description: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  confirmVariant?: "default" | "destructive" | "outline";
  onConfirm: () => void;
  
  disabled?: boolean;
  isPending?: boolean;
  zIndex?: number;
};

export default function ConfirmDialog({
  open,
  isOpen,
  setOpen,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  onConfirm,
  disabled,
  isPending,
  zIndex = 30,
}: ConfirmDialogProps) {
  const activeOpen = open !== undefined ? open : (isOpen !== undefined ? isOpen : false);
  const activeDisabled = disabled !== undefined ? disabled : (isPending !== undefined ? isPending : false);

  const handleConfirm = () => {
    if (activeDisabled) return;
    onConfirm();
  };

  const handleClose = () => {
    if (activeDisabled) return;
    if (setOpen) setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={activeOpen} onOpenChange={(v) => !activeDisabled && handleClose()}>
      <DialogContent
        className="
          w-[95vw]
          sm:max-w-md
          bg-zinc-950
          border border-zinc-900
          rounded-2xl
          p-0
          overflow-hidden
          shadow-2xl
          flex flex-col
          max-h-[85vh]
        "
        style={{ zIndex }}
        onInteractOutside={(e) => activeDisabled && e.preventDefault()}
        onEscapeKeyDown={(e) => activeDisabled && e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="p-5 border-b border-zinc-900/70">
          <DialogTitle className="text-zinc-100 text-base font-semibold">
            {title}
          </DialogTitle>

          <DialogDescription className="text-zinc-400 text-xs mt-1 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-zinc-900/70 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={activeDisabled}
            className="w-full sm:w-auto border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl h-9"
          >
            {cancelText}
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={activeDisabled}
            className={`
              w-full sm:w-auto
              flex items-center justify-center gap-2
              rounded-xl h-9
              ${confirmVariant === "destructive"
                ? "bg-red-600 hover:bg-red-700 text-white border-0"
                : "bg-indigo-600 hover:bg-indigo-700 text-white border-0"
              }
            `}
          >
            {activeDisabled ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}