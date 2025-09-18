
"use client"
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-md transition-colors hover:bg-gray-50 cursor-pointer"
    >
      <FcGoogle className="w-5 h-5" />
      <span className="text-sm">Sign in with Google</span>
    </button>
  );
}
