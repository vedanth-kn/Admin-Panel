import React, { useState, useEffect, useRef } from 'react';
import {
  Navbar,
  NavbarContent,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Search, Bell, Calendar, Filter, Moon, Sun } from "lucide-react";
import { useAuth } from '../auth/AuthProvider';
import { apiService } from '@/services/api';
import { useTheme } from '@/contexts/ThemeProvider';

export const TopNavbar = ({ onFilterChange, onSearch }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const profileRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || "Unknown User";
  };

  const getInitial = () => {
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onFilterChange(category);
    setShowFilter(false);
  };

  const handleSearch = (value) => {
    onSearch(value);
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  
  return (
    <div className="relative">
      <Navbar 
        className="sticky top-3 mt-3 ml-6 w-[97%] bg-white dark:bg-gray-800 rounded-[12px] transition-colors duration-200" 
        maxWidth="full"
        height="5rem"
      >
        <NavbarContent className="gap-4" justify="start">
          <div className="flex items-center gap-4 w-full">
            <div className="relative flex-1 max-w-[26rem]">
              <Input
                classNames={{
                  base: "w-full",
                  mainWrapper: "h-full",
                  input: "p-3 text-medium dark:text-white",
                  inputWrapper: "h-full font-normal text-default-500 bg-[#D6DDE3] dark:bg-gray-700 rounded-[30px]",
                }}
                placeholder="Search..."
                size="lg"
                endContent={<Search size={20} className="text-gray-500 dark:text-gray-400 mr-2" />}
                type="search"
                onChange={(e) => handleSearch(e.target.value)}
              />
              
            </div>
          </div>
        </NavbarContent>

        <NavbarContent justify="end">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Calendar size={16} />
              <span>{currentDate}</span>
            </div>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly variant="light" className="text-gray-500 dark:text-gray-400">
                  <Bell size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Notifications" className="dark:bg-gray-800 dark:text-white">
                <DropdownItem className="dark:hover:bg-gray-700">No new notifications</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              isIconOnly
              variant="light"
              className="text-gray-500 dark:text-gray-400"
              onClick={toggleTheme}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <div className="relative">
              <Button 
                onClick={() => setShowProfile(!showProfile)}
                className="m-2 h-14 w-14 rounded-full bg-[#bcced5] dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-white"
              >
                {getInitial()}
              </Button>

              {showProfile && (
                <div className="absolute top-full right-0 w-72 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-[#bcced5] dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-white">
                        {getInitial()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {getFullName()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || "No email available"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      User ID: {user?.user_id || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Phone: {user?.phone_number || 'N/A'}
                    </div>
                    <Button 
                      onClick={handleLogout}
                      className="w-full bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </NavbarContent>
      </Navbar>

      {showFilter && (
        <div className="absolute top-20 left-[26rem] w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          <h3 className="font-semibold mb-2 dark:text-white">Business Category</h3>
          <div className="space-y-2">
            <div 
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                selectedCategory === "" ? "bg-gray-100 dark:bg-gray-700" : ""
              } dark:text-white`}
              onClick={() => handleCategorySelect("")}
            >
              All Categories
            </div>
            {categories.map((category) => (
              <div
                key={category}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedCategory === category ? "bg-gray-100 dark:bg-gray-700" : ""
                } dark:text-white`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopNavbar;