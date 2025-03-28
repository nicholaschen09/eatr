import React from "react";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl">Eatr</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Find Food
            </Link>
            <Link
              href="/history"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Order History
            </Link>
          </nav>
        </div>
        <div className="flex justify-end">
          <Link
            href="/profile"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
