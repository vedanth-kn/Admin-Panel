'use client';
import React, { useState, useEffect } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button, Autocomplete, AutocompleteItem, Input } from "@heroui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from 'lucide-react';
import { apiService } from '@/services/api';
import { label } from 'framer-motion/client';

const categories = [
    {label: "Orders", value: "ORDERS"},
    {label: "Brands", value: "BRANDS"},
    {label: "Vouchers", value: "VOUCHERS"},
    {label: "Games", value: "GAMES"},
];

const MilestoneCreateDialog = ({ 
    isOpen, 
    setIsOpen,  
    formData, 
    setFormData,
    isLoading,
    onSuccessfulSubmit,
    editMode = false,
    milestoneId = null
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
                target_value: 0,
                reward_coins: 0,
                milestone_type: '',
                start_time: '',
                end_time: ''
            });
        }
    }, [formData, setFormData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formDataToSubmit = {
                id: editMode ? milestoneId : undefined, // Include ID only in edit mode
                name: formData.name,
                description: formData.description,
                target_value: formData.target_value,
                reward_coins: formData.reward_coins,
                milestone_type: formData.milestone_type,
                start_time: formData.start_time,
                end_time: formData.end_time,
                active: true,
            };

            console.log(formDataToSubmit);

            const response = editMode
                ? await apiService.updateMilestone(milestoneId, JSON.stringify(formDataToSubmit))
                : await apiService.createMilestone(JSON.stringify(formDataToSubmit));

            if (response.success) {
                onSuccessfulSubmit?.();
                setIsOpen(false);
            }
        } catch (err) {
            setError(err.message);
            console.error(editMode ? 'Milestone update error:' : 'Milestone creation error:', err);
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
                            {editMode ? 'Edit Milestone' : 'Add New Milestone'}
                        </Dialog.Title>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="milestoneForm" onSubmit={handleSubmit} className="space-y-4">
                            {/* First Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name" className="block mb-2">Milestone Name</Label>
                                    <Input
                                        isRequired
                                        id="name"
                                        type="naame"
                                        label="Enter milestone name"
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

                                {/* Second Row */}
                                <div>
                                    <Label htmlFor="target_value" className="block mb-2">Target Value</Label>
                                    <Input
                                        id="target_value"
                                        type="number"
                                        value={formData.target_value}
                                        label="Set the targget value"
                                        onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                                    />
                                </div>

                                {/* Third Row */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Reward Coins</label>
                                    <Input
                                        type="number"
                                        label="Set reward coins"
                                        value={formData.reward_coins}
                                        onChange={(e) => setFormData({...formData, reward_coins: e.target.value})}
                                   />
                                    </div>

                                    <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <Input
                                        type="date"
                                        label="Select start date"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                    />
                                    </div>
                                    {/* Fourth Row */}
                                    <div>
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <Input
                                        type="date"
                                        label="Select end date"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                    />
                                </div>
                                <div className="relative">
                                    <Label htmlFor="milestone_type" className="block mb-2">Milestone Type</Label>
                                    <Autocomplete
                                        id="milestone_type"
                                        className="max-w-xs"
                                        defaultItems={categories}
                                        label="Select a milestone type"
                                        selectedKey={formData.milestone_type}
                                        onSelectionChange={(value) => {
                                            console.log('Selected milestone type:', value);
                                            setFormData({
                                                ...formData,
                                                milestone_type: value
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
                                form="milestoneForm"
                                className="add-button"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Add Milestone'}
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

export default MilestoneCreateDialog;