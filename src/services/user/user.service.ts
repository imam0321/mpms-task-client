"use server";

import { serverFetch } from "@/lib/server-fetch";
import { ApiResponse, IUser } from "@/types/api.types";

export async function getAllUsers(): Promise<ApiResponse<IUser[]>> {
  const res = await serverFetch.get("/users");
  return res.json();
}

export async function addMember(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  designation?: string;
  department?: string;
}): Promise<ApiResponse<IUser>> {
  const res = await serverFetch.post("/users", {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMember(
  id: string,
  data: Partial<{ name: string; role: string; designation: string; department: string; isActive: boolean }>
): Promise<ApiResponse<IUser>> {
  const res = await serverFetch.put(`/users/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function removeMember(id: string): Promise<ApiResponse<null>> {
  const res = await serverFetch.delete(`/users/${id}`);
  return res.json();
}
