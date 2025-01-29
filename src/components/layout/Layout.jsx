'use client';

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export default function Layout({ children }) {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <div className="min-h-screen flex transition-colors duration-200">
          <Sidebar />
          <div className="flex-1">
            <TopNavbar />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </HeroUIProvider>
  );
}