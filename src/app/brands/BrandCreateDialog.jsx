'use client';
import React, { useState, useEffect } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button } from "@heroui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from 'lucide-react';
import { apiService } from '@/services/api';

const categories = [
  "SHOPPING",
  "TRAVEL",
  "ENTERTAINMENT",
  "UTILITY",
  "FASHION",
  "FOOD_AND_GROCERY",
];

const BrandDialog = ({ 
    isOpen, 
    setIsOpen, 
    formData, 
    setFormData,
    isLoading,
    onSuccessfulSubmit,
    editMode = false,
    brandId = null
}) => {

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(categories);

    // Initialize form data with empty strings if not provided
    useEffect(() => {
        if (!formData) {
            setFormData({
                name: '',
                description: '',
                website_url: '',
                business_category: '',
                logoUrl: '',
                bannerUrl: '',
                brandImageUrl: ''
            });
        }
    }, [formData, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formDataToSubmit = {
                id: editMode ? brandId : undefined, // Include ID only in edit mode
                name: formData.name,
                description: formData.description,
                website_url: formData.website_url,
                business_category: formData.business_category,
                active: true,
                media_details: [
                    ...(formData.logoUrl ? [{ display_type: 'logo', file_name: formData.logoUrl.split('/').pop(), media_url: formData.logoUrl }] : []),
                    ...(formData.bannerUrl ? [{ display_type: 'banner', file_name: formData.bannerUrl.split('/').pop(), media_url: formData.bannerUrl }] : []),
                    ...(formData.brandImageUrl ? [{ display_type: 'brand_image', file_name: formData.brandImageUrl.split('/').pop(), media_url: formData.brandImageUrl }] : []),
                ],
            };

            const response = editMode
                ? await apiService.updateBrand(brandId, JSON.stringify(formDataToSubmit))
                : await apiService.createBrand(JSON.stringify(formDataToSubmit));

            if (response.success) {
                onSuccessfulSubmit?.();
                setIsOpen(false);
            }
        } catch (err) {
            setError(err.message);
            console.error(editMode ? 'Brand update error:' : 'Brand creation error:', err);
        } finally {
            setSubmitting(false);
        }
    };
   
    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        setFormData({ ...formData, business_category: value });
        setFilteredOptions(categories.filter((category) => category.includes(value)));
        setShowDropdown(value !== "" && filteredOptions.length > 0);
    };

    const handleOptionSelect = (option) => {
        setFormData({ ...formData, business_category: option });
        setShowDropdown(false);
    };

    

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="dialog-content">
                    <div className="p-6 border-b">
                        <Dialog.Title className="text-xl font-bold">
                            {editMode ? 'Edit Brand' : 'Add New Brand'}
                        </Dialog.Title>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="brandForm" onSubmit={handleSubmit} className="space-y-4">
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

                                {/* Second Row */}
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

                                {/* Third Row */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Logo URL</label>
                                    <input
                                        type="url"
                                        value={formData.logoUrl}
                                        onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                    </div>

                                    <div>
                                    <label className="block text-sm font-medium mb-1">Banner URL</label>
                                    <input
                                        type="url"
                                        value={formData.bannerUrl}
                                        onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                    </div>
                                    {/* Fourth Row */}
                                    <div>
                                    <label className="block text-sm font-medium mb-1">Brand Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.brandImageUrl}
                                        onChange={(e) => setFormData({...formData, brandImageUrl: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
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
                                form="brandForm"
                                className="add-button"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Add Brand'}
                            </Button>
                        </div>
                    </div>
                    <Dialog.Close asChild>
                        <button
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        aria-label="Close"
                        >
                        <X/>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default BrandDialog;