'use client';
import React, { useState, useEffect } from 'react';
import { Label } from "@radix-ui/react-label";
import { 
    Button, 
    Select, 
    SelectItem, 
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/react";
import { X } from 'lucide-react';
import { apiService } from '@/services/api';

const GENDER = [
    {label: "Male", value: "MALE"},
    {label: "Female", value: "FEMALE"},
    {label: "Other", value: "OTHER"},
];

const UserCreateModal = ({ 
    isOpen, 
    onOpenChange,
    formData, 
    setFormData,
    isLoading,
    onSuccessfulSubmit,
    editMode = false,
    userId = null
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);

    // Initialize form data with empty strings if not provided
    useEffect(() => {
        if (!formData) {
            setFormData({
                username: '',
                email: '',
                phone_number: '',
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
                email: formData.email,
                phone_number: formData.phone_number,
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
                ? await apiService.updateUser(userId, JSON.stringify(formDataToSubmit))
                : await apiService.createUser(JSON.stringify(formDataToSubmit));

            if (response.success) {
                onSuccessfulSubmit?.();
                onOpenChange(false);
            }
        } catch (err) {
            console.error('Error details:', err);
            
            try {
                // Parse the API error response
                const apiError = err.response?.data;
                const phoneErrorMessage = apiError?.errorMessage || 
                    apiError?.message || 
                    "Phone number already registered.";
                
                setPhoneError(phoneErrorMessage);
            } catch (parseError) {
                // Fallback to default error handling if parsing fails
                setError(err.message || 'An unexpected error occurred');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            size='4xl'
            className='bg-white dark:bg-gray-900'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {editMode ? 'Edit User' : 'Add New User'}
                        </ModalHeader>
                        
                        <ModalBody>
                            <form id="userForm" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="username" className="block mb-2">Username</Label>
                                        <Input
                                            isRequired
                                            id="username"
                                            type="username"
                                            label="Enter username"
                                            value={formData.username}
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
                                        <Label htmlFor="phone_number" className="block mb-2">Phone Number</Label>
                                        <Input
                                            id="phone_number"
                                            type="phone"
                                            label="Enter phone number"
                                            value={formData.phone_number}
                                            onChange={(e) => {
                                                setFormData({ ...formData, phone_number: e.target.value });
                                                if (phoneError) setPhoneError(null);
                                            }}
                                            className={phoneError ? 'border-red-500' : ''}
                                        />
                                        {phoneError && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {phoneError}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="first_name" className="block mb-2">First Name</Label>
                                        <Input
                                            id="first_name"
                                            type="name"
                                            label="Enter first name"
                                            value={formData.first_name}
                                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="last_name" className="block mb-2">Last Name</Label>
                                        <Input
                                            id="last_name"
                                            type="name"
                                            label="Enter last name"
                                            value={formData.last_name}
                                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="profileUrl" className="block mb-2">Profile URL</Label>
                                        <Input
                                            id="profileUrl"
                                            type="url"
                                            label="Enter profile URL"
                                            value={formData.profileUrl}
                                            onChange={(e) => setFormData({...formData, profileUrl: e.target.value})}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="date_of_birth" className="block mb-2">Date of Birth</Label>
                                        <Input
                                            id="date_of_birth"
                                            type="date"
                                            label="Select date of birth"
                                            value={formData.date_of_birth}
                                            onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender" className="block mb-2">Gender</Label>
                                        <Select 
                                            id="gender"
                                            className="max-w-xs"
                                            items={GENDER}
                                            label="Select a gender"
                                            selectedKey={formData.gender}
                                            onSelectionChange={(value) => {
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
                                    </div>
                                    <div>
                                        <Label htmlFor="address" className="block mb-2">Address</Label>
                                        <Input
                                            id="address"
                                            type="text"
                                            label="Enter address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="city" className="block mb-2">City</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            label="Enter city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state" className="block mb-2">State</Label>
                                        <Input
                                            id="state"
                                            type="text"
                                            label="Enter state"
                                            value={formData.state}
                                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country" className="block mb-2">Country</Label>
                                        <Input
                                            id="country"
                                            type="text"
                                            label="Enter country"
                                            value={formData.country}
                                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="zip_code" className="block mb-2">Zip Code</Label>
                                        <Input
                                            id="zip_code"
                                            type="text"
                                            label="Enter zip code"
                                            value={formData.zip_code}
                                            onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </form>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                type="submit"
                                form="userForm"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : editMode ? 'Update User' : 'Add User'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default UserCreateModal;