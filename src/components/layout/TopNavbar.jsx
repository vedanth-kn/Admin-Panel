'use client';

import React from 'react';
import {
  Navbar,
  NavbarContent,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Link
} from "@nextui-org/react";
import { Search, Bell, Calendar, LogOut } from "lucide-react";

export const TopNavbar = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  return (
    <Navbar 
      className="mt-5 w-[98%] flex  bg-white border border-gray-300 rounded-[16px]" 
      maxWidth="full"
      height="6rem"
    >
      <NavbarContent className="gap-4" justify="start">
  <div className="flex items-center w-full">
    <Input
      classNames={{
        base: "max-w-full sm:max-w-[26rem] h-12", // Increased width and height
        mainWrapper: "h-full",
        input: "p-3 text-medium", // Adjusted text size
        inputWrapper: "h-full w-full font-normal text-default-500 bg-[#ddebf0] dark:bg-default-500/20 rounded-[30px]", // Full width for wrapper
      }}
      placeholder="Search..."
      size="lg" // Increased size
      endContent={<Search size={20} className="text-black-500 mr-2" />} // Moved icon to the end
      type="search"
    />
  </div>
</NavbarContent>


      <NavbarContent justify="end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-default-500">
            <Calendar size={16} />
            <span>{currentDate}</span>
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" className="text-default-500">
                <Bell size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications">
              <DropdownItem>No new notifications</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Link href="/" className="w-[130px] h-12 p-5 bg-black text-gray-400 hover:text-gray-600 rounded-[30px]">
            <p className='text-white'>Logout</p>
            <LogOut className='m-2 h-6 w-6'/>
          </Link>
          
        </div>
      </NavbarContent>
    </Navbar>
  );
};

