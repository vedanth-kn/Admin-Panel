import React, { useState } from 'react';
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

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

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
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
                  inputWrapper: "h-full font-normal text-default-500 bg-[#ddebf0] dark:bg-default-500/20 rounded-[30px]",
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
                className="m-2 h-14 w-14 rounded-full bg-[#bcced5] flex items-center justify-center"
              >
                {user?.name?.charAt(0) || "U"}
              </Button>

              {showProfile && (
                <div className="absolute top-full right-0 w-60 mt-2 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-center">
                      <p className="text-[22px] font-bold">{user?.name || "Unknown User"}</p>
                      <p className="text-xs text-gray-700 truncate">{user?.email || "No Email Available"}</p>
                    </div>
                    <Button 
                      onClick={handleLogout}
                      className="mt-2 w-full bg-red-500 text-white rounded-lg hover:bg-red-600"
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