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
    {label: "Orders", value: "ORDERS"},
    {label: "Brands", value: "BRANDS"},
    {label: "Vouchers", value: "VOUCHERS"},
    {label: "Games", value: "GAMES"},
];

const MilestoneCreateModal = ({ 
    isOpen, 
    onOpenChange,
    formData, 
    setFormData,
    isLoading,
    onSuccessfulSubmit,
    editMode = false,
    milestoneId = null
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [filteredOptions, setFilteredOptions] = useState(categories);

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
                id: editMode ? milestoneId : undefined,
                name: formData.name,
                description: formData.description,
                target_value: Number(formData.target_value),
                reward_coins: Number(formData.reward_coins),
                milestone_type: formData.milestone_type,
                start_time: formData.start_time,
                end_time: formData.end_time,
                active: true,
            };

            const response = editMode
                ? await apiService.updateMilestone(milestoneId, JSON.stringify(formDataToSubmit))
                : await apiService.createMilestone(JSON.stringify(formDataToSubmit));

            if (response.success) {
                onSuccessfulSubmit?.();
                onOpenChange(false);
            }
            console.log(formDataToSubmit)
        } catch (err) {
            setError(err.message);
            console.error(editMode ? 'Milestone update error:' : 'Milestone creation error:', err);
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
                            {editMode ? 'Edit Milestone' : 'Add New Milestone'}
                        </ModalHeader>
                        
                        <ModalBody>
                            <form id="milestoneForm" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name" className="block mb-2">Milestone Name</Label>
                                        <Input
                                            isRequired
                                            id="name"
                                            type="text"
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

                                    <div>
                                        <Label htmlFor="target_value" className="block mb-2">Target Value</Label>
                                        <Input
                                            id="target_value"
                                            type="number"
                                            value={formData.target_value}
                                            label="Set the target value"
                                            onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="reward_coins" className="block mb-2">Reward Coins</Label>
                                        <Input
                                            id="reward_coins"
                                            type="number"
                                            label="Set reward coins"
                                            value={formData.reward_coins}
                                            onChange={(e) => setFormData({...formData, reward_coins: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="start_time" className="block mb-2">Start Date</Label>
                                        <Input
                                            id="start_time"
                                            type="datetime-local"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="end_time" className="block mb-2">End Date</Label>
                                        <Input
                                            id="end_time"
                                            type="datetime-local"
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
                                form="milestoneForm"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : editMode ? 'Update Milestone' : 'Add Milestone'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default MilestoneCreateModal;