'use client';
import React, { useState, useEffect } from 'react';
import { Label } from "@radix-ui/react-label";
import { 
    Button, 
    Autocomplete, 
    AutocompleteItem, 
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@heroui/react";
import { apiService } from '@/services/api';

const categories = [
    {label: "Shopping", value: "SHOPPING"},
    {label: "Travel", value: "TRAVEL"},
    {label: "Fashion", value: "FASHION"},
    {label: "Utility", value: "UTILITY"},
    {label: "Food and Grocery", value: "FOOD_AND_GROCERY"},
];

const BrandCreateModal = ({ 
    isOpen, 
    onOpenChange,  
    formData, 
    setFormData,
    isLoading,
    onSuccessfulSubmit,
    editMode = false,
    brandId = null
}) => {

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

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
                id: editMode ? brandId : undefined,
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
                onOpenChange(false);
            }
        } catch (err) {
            setError(err.message);
            console.error(editMode ? 'Brand update error:' : 'Brand creation error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            size='2xl'
            color='primary'
            className='bg-white dark:bg-gray-900'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {editMode ? 'Edit Brand' : 'Add New Brand'}
                        </ModalHeader>
                        
                        <ModalBody>
                            <form id="brandForm" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name" className="block mb-2">Brand Name</Label>
                                        <Input
                                            isRequired
                                            id="name"
                                            type="text"
                                            label="Enter brand name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description" className="block mb-2">Description</Label>
                                        <Input 
                                            id="description"
                                            label="Enter description"
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="website_url" className="block mb-2">Website URL</Label>
                                        <Input
                                            id="website_url"
                                            type="url"
                                            label="Enter website URL"
                                            value={formData.website_url}
                                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                        />
                                    </div>
                                    
                                    <div className="relative">
                                        <Label htmlFor="business_category" className="block mb-2">Business Category</Label>
                                        <Autocomplete
                                            id="business_category"
                                            className="max-w-xs"
                                            defaultItems={categories}
                                            label="Select a business category"
                                            selectedKey={formData.business_category}
                                            onSelectionChange={(value) => {
                                                setFormData({
                                                    ...formData,
                                                    business_category: value
                                                });
                                            }}
                                        >
                                            {(item) => (
                                                <AutocompleteItem key={item.value}>
                                                {item.label}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Logo URL</label>
                                        <Input
                                            type="url"
                                            label="Enter logo URL"
                                            value={formData.logoUrl}
                                            onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Banner URL</label>
                                        <Input
                                            type="url"
                                            label="Enter banner URL"
                                            value={formData.bannerUrl}
                                            onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Brand Image URL</label>
                                        <Input
                                            type="url"
                                            label="Enter brand URL"
                                            value={formData.brandImageUrl}
                                            onChange={(e) => setFormData({...formData, brandImageUrl: e.target.value})}
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
                                form="brandForm"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : editMode ? 'Update Brand' : 'Add Brand'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default BrandCreateModal;