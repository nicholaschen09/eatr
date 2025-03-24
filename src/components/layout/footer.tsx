import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Link href="/" className="font-bold">
            Eatr
          </Link>
          <nav className="flex flex-wrap gap-4 md:gap-6">
            <Link
              href="/"
              className="text-xs md:text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/privacy"
              className="text-xs md:text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs md:text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-xs md:text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Eatr. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
