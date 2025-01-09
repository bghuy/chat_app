// components/ClientWrapper.tsx
"use client"; // Đảm bảo component này chạy trên client

import { useEffect, useState } from "react";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Chờ đến khi client-side rendering hoàn tất

  return <>{children}</>;
};
