'use client';
import React, { useState, useEffect } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button, Select, SelectItem, Input } from "@heroui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from 'lucide-react';
import { apiService } from '@/services/api';
import { label } from 'framer-motion/client';

const GENDER = [
    {label: "Male", value: "MALE"},
    {label: "Female", value: "FEMALE"},
    {label: "Other", value: "OTHER"},
];

const UserCreateDialog = ({ 
    isOpen, 
    setIsOpen,  
    formData, 
    setFormData,
    isLoading,
    onSuccessfulSubmit,
    editMode = false,
    userId = null
}) => {

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Initialize form data with empty strings if not provided
    useEffect(() => {
        if (!formData) {
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                profileUrl: '',
                date_of_birth: '',
                gender: '',
                address: '',
                city: '',
                state: '',
                country: '',
                zip_code: '',
            });
        }
    }, [formData, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formDataToSubmit = {
                id: editMode ? userId : undefined, // Include ID only in edit mode
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                date_of_birth: formData.date_of_birth,
                gender: formData.gender,
                address: formData.address,
                city: formData.city,
                last_statename: formData.state,
                country: formData.country,
                zip_code: formData.zip_code,
                active: true,
                media_details: [
                    ...(formData.profileUrl ? [{ 
                        display_type: 'profile_picture', 
                        file_name: formData.profileUrl.split('/').pop(), 
                        media_url: formData.profileUrl }] : []),
                ],
            };

            console.log(formDataToSubmit);

            const response = editMode
                ? await apiService.updateBrand(userId, JSON.stringify(formDataToSubmit))
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

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl shadow-lg flex flex-col max-h-[90vh] z-50">
                    <div className="p-6 border-b">
                        <Dialog.Title className="text-xl font-bold">
                            {editMode ? 'Edit Brand' : 'Add New Brand'}
                        </Dialog.Title>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="brandForm" onSubmit={handleSubmit} className="space-y-4">
                            {/* First Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="username" className="block mb-2">username</Label>
                                    <Input
                                        isRequired
                                        id="username"
                                        type="username"
                                        label="Enter username"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="block mb-2">Email</Label>
                                    <Input 
                                        id="email"
                                        label="Enter email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="first_name" className="block mb-2">First Name</Label>
                                    <Input
                                        id="websifirst_namete_url"
                                        type="name"
                                        label="Enter first name"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>

                                {/* Second Row */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Last Name</label>
                                    <Input
                                        type="name"
                                        label="Enter last name"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Profile URL</label>
                                    <Input
                                        type="url"
                                        label="Enter profile URL"
                                        value={formData.profileUrl}
                                        onChange={(e) => setFormData({...formData, profileUrl: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                                    <Input
                                        type="date"
                                        label="Select date of birth"
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                    />
                                </div>
                                    
                                {/* Third Row */}
                                <div>
                                <label className="block text-sm font-medium mb-1">Gender</label>
                                <Select 
                                    id="gender"
                                    className="max-w-xs"
                                    items={GENDER}
                                    label="Select a gender"
                                    selectedKey={formData.gender}
                                    onSelectionChange={(value) => {
                                        console.log('Selected gender:', value);
                                        setFormData({
                                            ...formData,
                                            gender: value
                                        });
                                    }}
                                >
                                    {(item) => (
                                        <SelectItem key={item.value}>
                                        {item.label}
                                        </SelectItem>
                                    )}
                                </Select>
                                    {/* <label className="block text-sm font-medium mb-1">Gender</label>
                                    <Input
                                        type="text"
                                        label="Select Gender"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    /> */}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <Input
                                        type="text"
                                        label="Enter address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <Input
                                        type="text"
                                        label="Enter city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>

                                {/* Fourth Row */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">State</label>
                                    <Input
                                        type="text"
                                        label="Enter state"
                                        value={formData.state}
                                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Country</label>
                                    <Input
                                        type="text"
                                        label="Enter country"
                                        value={formData.country}
                                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Zip Code</label>
                                    <Input
                                        type="text"
                                        label="Enter zip code"
                                        value={formData.zip_code}
                                        onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
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

export default UserCreateDialog;