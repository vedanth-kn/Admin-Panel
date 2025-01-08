'use client'

import React from 'react'
import {
  Navbar,
  NavbarContent,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react"
import { Search, Bell, Calendar, LogOut } from "lucide-react"
import { useAuth } from '../auth/AuthProvider'

export const TopNavbar = () => {
  const { logout } = useAuth()
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  })

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Navbar 
      className="sticky top-3 ml-6 mt-3 mb-3 w-[97%] flex bg-white border-4 border-[#cadce3] border-gray-300 rounded-[16px]" 
      maxWidth="full"
      height="6rem"
    >
      <NavbarContent className="gap-4" justify="start">
        <div className="flex items-center w-full">
          <Input
            classNames={{
              base: "max-w-full sm:max-w-[26rem] h-12",
              mainWrapper: "h-full",
              input: "p-3 text-medium",
              inputWrapper: "h-full w-full font-normal text-default-500 bg-[#ddebf0] dark:bg-default-500/20 rounded-[30px]",
            }}
            placeholder="Search..."
            size="lg"
            endContent={<Search size={20} className="text-black-500 mr-2" />}
            type="search"
          />
        </div>
      </NavbarContent>

      <NavbarContent justify="end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-default-700">
            <Calendar size={16} />
            <span>{currentDate}</span>
          </div>

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" className="text-default-700">
                <Bell size={20} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications">
              <DropdownItem>No new notifications</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Link href="/" className="flex justify-center w-[130px] h-12 p-5 bg-black text-gray-100 hover:text-gray-600 rounded-[30px]">
            <p className='text-white'>Logout</p>
            <LogOut className='m-2 h-6 w-6'/>
          </Link>    
          <Button 
            onClick={handleLogout}
            className="w-[130px] h-12 p-5 bg-black text-white hover:bg-gray-800 rounded-[30px] flex items-center justify-between"
          >
            Logout
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </NavbarContent>
    </Navbar>
  )
}