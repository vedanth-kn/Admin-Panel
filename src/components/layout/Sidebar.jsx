'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // For getting the current route
import { Link } from "@nextui-org/react";
import { LayoutDashboard, Users, UserCircle, Shield, Lock, Settings, Ticket, Tag, Briefcase  } from "lucide-react";

export const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Teams', href: '/teams', icon: UserCircle },
    { name: 'Roles', href: '/roles', icon: Shield },
    { name: 'Brands', href: '/brands', icon: Briefcase },
    { name: 'Coupons', href: '/coupons', icon: Tag },
    { name: 'Vouchers', href: '/vouchers', icon: Ticket },
    { name: 'Permissions', href: '/permissions', icon: Lock },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const pathname = usePathname(); // Get the current route

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  return (
    <aside className="sticky top-3 left-3 h-[calc(100vh-1.5rem)] w-64 flex flex-col bg-white border border-gray-300 rounded-[16px] border-4 border-[#C5D2DD]">
      <div className="p-6">
        <div className="pb-4 font-bold text-[46px] text-gray-800 text-center border-b border-[#bcced5]">ZOGG</div>
      </div>
      <nav className="flex-1  overflow-y-auto space-y-1 px-6">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-[30px] 
              ${pathname === item.href 
                ? 'text-white bg-gray-800' // Active styles
                : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
