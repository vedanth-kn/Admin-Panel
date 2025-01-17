'use client';
import React, { useState } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button } from "@nextui-org/react";
import * as Dialog from "@radix-ui/react-dialog";

const categories = [
  "SHOPPING",
  "TRAVEL",
  "ENTERTAINMENT",
  "UTILITY",
  "FASHION",
  "FOOD_AND_GROCERY",
];


export default function VoucherDialog({ isOpen, setIsOpen, formData, setFormData, handleSubmit }) {
    const [filteredOptions, setFilteredOptions] = useState(categories);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        setFormData({ ...formData, business_category: value });

        // Filter categories based on input
        setFilteredOptions(
            categories.filter((category) =>
                category.includes(value)
            )
        );

        // Show dropdown if value exists and matches are found
        setShowDropdown(value !== "" && filteredOptions.length > 0);
    };

    const handleOptionSelect = (option) => {
        setFormData({ ...formData, business_category: option });
        setShowDropdown(false);
    };
    const handleFileChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.files[0]
        });
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-full max-w-4xl flex flex-col h-[90vh]" style={{ zIndex: 50 }}>
                    {/* Fixed Header */}
                    <div className="p-6 border-b">
                        <Dialog.Title className="text-xl font-bold">Add New Brand</Dialog.Title>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="voucherForm" onSubmit={handleSubmit} className="space-y-4">
                            {/* First Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name" className="block mb-2">Brand Name</Label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description" className="block mb-2">Description</Label>
                                    <input
                                        id="description"
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Second Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="website_url" className="block mb-2">Website URL</Label>
                                    <input
                                        id="website_url"
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Website URL"
                                        value={formData.website_url}
                                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <Label htmlFor="business_category" className="block mb-2">Business Category</Label>
                                    <input
                                        id="business_category"
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Select Categor"
                                        value={formData.business_category}
                                        onChange={handleInputChange}
                                        onFocus={() => setShowDropdown(true)}
                                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow option selection
                                    />
                                    {/* Dropdown */}
                                    {showDropdown && (
                                        <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto z-10">
                                            {filteredOptions.length > 0 ? (
                                                filteredOptions.map((option, index) => (
                                                    <li
                                                        key={index}
                                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                        onClick={() => handleOptionSelect(option)}
                                                    >
                                                        {option}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="px-3 py-2 text-gray-500">No matches found</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="image" className="block mb-2">Image</Label>
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            type="button"
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                                            onClick={() => document.getElementById('image').click()}
                                        >
                                            Choose
                                        </Button>
                                        <input
                                            id="image"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange('image')}
                                        />
                                        <span className="truncate">{formData.image?.name || ''}</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Fixed Footer */}
                    <div className="p-6 border-t">
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="voucherForm"
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                Save Brand
                            </Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
