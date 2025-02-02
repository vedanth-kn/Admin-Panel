'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from "@heroui/react";
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Shield, 
  Lock, 
  Settings, 
  Ticket, 
  Tag, 
  Briefcase, 
  Flag, 
} from "lucide-react";

export const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Teams', href: '/teams', icon: UserCircle },
    { name: 'Roles', href: '/roles', icon: Shield },
    { name: 'Brands', href: '/brands', icon: Briefcase },
    { name: 'Vouchers', href: '/vouchers', icon: Ticket },
    { name: 'Coupons', href: '/coupons', icon: Tag },
    { name: 'Milestones', href: '/milestones', icon: Flag },
    { name: 'Permissions', href: '/permissions', icon: Lock },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const [name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  return (
    <aside className="sticky top-3 left-3 h-[calc(100vh-1.5rem)] w-64 flex flex-col bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-[16px] border-4 border-[#C5D2DD] dark:border-gray-600 transition-colors duration-200">
      <div className="p-6">
        <div className="pb-4 font-bold text-[46px] text-gray-800 dark:text-white text-center border-b border-[#bcced5] dark:border-gray-600">
          ZOGG
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto space-y-1 px-6">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-[30px] transition-colors duration-200
              ${pathname === item.href 
                ? 'text-white bg-gray-800 dark:bg-gray-700' // Active styles
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
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