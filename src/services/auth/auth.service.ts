/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { verifyAccessToken } from "@/lib/jwt";
import { getCookie, deleteCookie, setCookie } from "./tokenHandlers";
import { serverFetch } from "@/lib/server-fetch";
import { parse } from "set-cookie-parser";
import type { Cookie } from "set-cookie-parser";


export async function getNewAccessToken() {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    if (!accessToken && !refreshToken) {
      return {
        tokenRefreshed: false,
      };
    }

    if (accessToken) {
      const verifiedToken = await verifyAccessToken(accessToken);

      if (verifiedToken.success) {
        return {
          tokenRefreshed: false,
        };
      }
    }

    if (!refreshToken) {
      return {
        tokenRefreshed: false,
      };
    }

    let accessTokenObject: Cookie | null = null;
    let refreshTokenObject: Cookie | null = null;

    const response = await serverFetch.post("/auth/refresh-token", {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const result = await response.json();

    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      for (const cookie of setCookieHeaders) {
        const parsedCookies = parse(cookie);
        const parsedCookie = parsedCookies[0];

        if (parsedCookie) {
          if (parsedCookie.name === "accessToken") {
            accessTokenObject = parsedCookie;
          }
          if (parsedCookie.name === "refreshToken") {
            refreshTokenObject = parsedCookie;
          }
        }
      }
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    if (!refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    await deleteCookie("accessToken");
    await setCookie("accessToken", accessTokenObject.value, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: accessTokenObject.maxAge || 60 * 60 * 24,
      path: accessTokenObject.path || "/",
    });

    await deleteCookie("refreshToken");
    await setCookie("refreshToken", refreshTokenObject.value, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: refreshTokenObject.maxAge || 60 * 60 * 24 * 30,
      path: refreshTokenObject.path || "/",
    });

    if (!result.success) {
      throw new Error(result.message || "Token refresh failed");
    }

    return {
      tokenRefreshed: true,
      success: true,
      message: "Token refreshed successfully",
    };
  } catch (error: any) {
    return {
      tokenRefreshed: false,
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}