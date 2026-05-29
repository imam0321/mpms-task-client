"use server";

import { redirect } from "next/navigation";
import { deleteCookie } from "./tokenHandlers";

export async function logoutUser() {
  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
  redirect("/login");
}
