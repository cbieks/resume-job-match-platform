"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    signOut({
      redirect: false,
      callbackUrl: "/",
    }).then(() => {
      router.push("/");
      router.refresh();
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Signing you out...</p>
      </div>
    </div>
  );
}

