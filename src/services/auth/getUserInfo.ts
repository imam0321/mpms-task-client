import { getCookie } from "./tokenHandlers";
import { verifyAccessToken } from "@/lib/jwt";
import { UserRole } from "@/lib/auth.utils";

export interface IUserInfo {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  profileImg?: string;
}

export async function getUserInfo(): Promise<IUserInfo | null> {
  const token = await getCookie("accessToken");
  if (!token) return null;

  const result = await verifyAccessToken(token);
  if (result.success && result.payload) {
    return {
      id: result.payload.id || result.payload._id,
      email: result.payload.email,
      role: result.payload.role as UserRole,
      name: result.payload.name,
      profileImg: result.payload.profileImg,
    };
  }

  return null;
}
