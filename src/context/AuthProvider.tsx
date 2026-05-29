"use client";

import React, { createContext, useContext } from "react";
import { IUserInfo } from "@/services/auth/getUserInfo";

interface AuthContextType {
  user: IUserInfo | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export default function AuthProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: IUserInfo | null;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
