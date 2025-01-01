'use client';

// src/components/layout/Layout.jsx
import { NextUIProvider } from "@nextui-org/react";
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export default function Layout({ children }) {
  return (
    <NextUIProvider>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <TopNavbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </NextUIProvider>
  );
}
