import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Resume & Job Match Platform
        </h1>
        <p className="text-center text-lg mb-8">
          Upload your resume and find matching job opportunities powered by AI
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/signin">
            <Button variant="primary" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="secondary" size="lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

