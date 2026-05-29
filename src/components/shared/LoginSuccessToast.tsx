"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LoginSuccessToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shown = useRef(false);

  useEffect(() => {
    const isLoggedIn = searchParams.get("loggedIn") === "true";
    const isRegistered = searchParams.get("registered") === "true";

    if ((isLoggedIn || isRegistered) && !shown.current) {
      shown.current = true;

      if (isRegistered) {
        toast.success("Registration successful! Welcome aboard 🎉");
      } else {
        toast.success("You have been logged in successfully.");
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("loggedIn");
      url.searchParams.delete("registered");
      router.replace(url.pathname + (url.searchParams.toString() ? "?" + url.searchParams.toString() : ""));
    }
  }, [searchParams, router]);

  return null;
}