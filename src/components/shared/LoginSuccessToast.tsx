"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LoginSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shown = useRef(false);

  useEffect(() => {
    if (searchParams.get("loggedIn") === "true" && !shown.current) {
      shown.current = true;
      toast.success("You have been logged in successfully.");
      const url = new URL(window.location.href);
      url.searchParams.delete("loggedIn");
      router.replace(url.pathname + (url.searchParams.toString() ? "?" + url.searchParams.toString() : ""));
    }
  }, [searchParams, router]);

  return null;
}