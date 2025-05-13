'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/50 border-t">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">
              <span className="text-primary">Plot</span>Pact
            </h3>
            <p className="text-muted-foreground">Interactive Storytelling with Human-AI Constraint Negotiation</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PlotPact. All rights reserved.
        </div>
      </div>
    </footer>
  );
}