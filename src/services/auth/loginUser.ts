"use server";

import { parse } from "cookie";
import { redirect } from "next/navigation";
import { deleteCookie, setCookie } from "./tokenHandlers";
import { loginValidationZodSchema } from "@/zod/auth.validation";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { UserRole, isValidRedirectForRole, getDefaultDashboardRoute } from "@/lib/auth.utils";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function loginUser(_currentState: any, formData: FormData) {
   try {
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;
    const redirectPath = formData.get("redirectPath") || null;

    const payload = {
      email: formData.get("email"),
      password: formData.get("password")
    }

    const validatedPayload = zodValidator(payload, loginValidationZodSchema);

    if (!validatedPayload.success && validatedPayload.errors) {
      return {
        success: validatedPayload.success,
        message: "Validation failed",
        formData: payload,
        errors: validatedPayload.errors,
      }
    }

    if (!validatedPayload.data) {
      return {
        success: false,
        message: "Validation failed",
        formData: payload,
      }
    }

    const backendPayload = {
      email: validatedPayload.data.email,
      password: validatedPayload.data.password
    }

    const res = await serverFetch.post("/auth/login", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendPayload)
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Invalid email or password",
      };
    }

    const setCookieHeaders = res.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parseCookie = parse(cookie);

        if (parseCookie["accessToken"]) {
          accessTokenObject = parseCookie;
        }

        if (parseCookie["refreshToken"]) {
          refreshTokenObject = parseCookie;
        }
      })
    } else {
      return {
        success: false,
        message: "Authentication failed. Please try again.",
      };
    }

    if (!accessTokenObject) {
      return {
        success: false,
        message: "Authentication failed. Please try again.",
      };
    }
    if (!refreshTokenObject) {
      return {
        success: false,
        message: "Authentication failed. Please try again.",
      };
    }

    await setCookie("accessToken", accessTokenObject.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 60 * 60 * 24,
      path: accessTokenObject.Path || "/"
    })

    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: parseInt(refreshTokenObject["Max-Age"]) || 60 * 60 * 24 * 30,
      path: refreshTokenObject.Path || "/"
    })

    const verifyToken: JwtPayload | string = jwt.verify(accessTokenObject.accessToken, process.env.JWT_ACCESS_SECRET as string)

    if (typeof verifyToken === "string") {
      return {
        success: false,
        message: "Authentication failed. Please try again.",
      };
    }

    const userRole: UserRole = verifyToken.role;

    let targetRedirect = "";
    if (redirectPath) {
      const requestedPath = redirectPath.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        targetRedirect = requestedPath;
      } else {
        targetRedirect = getDefaultDashboardRoute(userRole);
      }
    } else {
      targetRedirect = getDefaultDashboardRoute(userRole);
    }

    const separator = targetRedirect.includes("?") ? "&" : "?";
    redirect(`${targetRedirect}${separator}loggedIn=true`);

  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error
    }
    return {
      success: false,
      message: error.message || "Login failed. Please try again."
    }
  }
}
