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
} from "@nextui-org/react";
import { Search, Bell, Calendar, Filter } from "lucide-react";
import { useAuth } from '../auth/AuthProvider';
import { apiService } from '@/services/api';

const categories = [
  "SHOPPING",
  "TRAVEL",
  "ENTERTAINMENT",
  "UTILITY",
  "FASHION",
  "FOOD_AND_GROCERY",
];

export const TopNavbar = ({ onFilterChange, onSearch }) => {
  const { user, logout } = useAuth();
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

  // Get user's full name
  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || "Unknown User";
  };

  // Get initial for avatar
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

  console.log('Current user in TopNavbar:', user);

  return (
    <div className="relative">
      <Navbar 
        className="sticky top-3 mt-3 ml-6 w-[97%] bg-white rounded-[12px]" 
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
                  input: "p-3 text-medium",
                  inputWrapper: "h-full font-normal text-default-500 bg-[#D6DDE3] dark:bg-default-500/20 rounded-[30px]",
                }}
                placeholder="Search..."
                size="lg"
                endContent={<Search size={20} className="text-black-500 mr-2" />}
                type="search"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Button
                isIconOnly
                variant="light"
                className="absolute right-12 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter size={20} className="text-default-500" />
              </Button>
            </div>
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

            <div className="relative">
              <Button 
                onClick={() => setShowProfile(!showProfile)}
                className="m-2 h-14 w-14 rounded-full bg-[#bcced5] flex items-center justify-center text-lg font-semibold text-gray-700"
              >
                {getInitial()}
              </Button>

              {showProfile && (
                <div className="absolute top-full right-0 w-72 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-[#bcced5] flex items-center justify-center text-lg font-semibold text-gray-700">
                        {getInitial()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getFullName()}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email || "No email available"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="text-sm text-gray-500 mb-2">
                      User ID: {user?.user_id || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 mb-3">
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

      {/* Filter Dropdown */}
      {showFilter && (
        <div className="absolute top-20 left-[26rem] w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <h3 className="font-semibold mb-2">Business Category</h3>
          <div className="space-y-2">
            <div 
              className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedCategory === "" ? "bg-gray-100" : ""}`}
              onClick={() => handleCategorySelect("")}
            >
              All Categories
            </div>
            {categories.map((category) => (
              <div
                key={category}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${selectedCategory === category ? "bg-gray-100" : ""}`}
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