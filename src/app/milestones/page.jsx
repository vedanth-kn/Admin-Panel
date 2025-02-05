'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus, Globe } from 'lucide-react';
import {Alert, Button, Pagination} from "@heroui/react";
import MilestoneCreateModal from './MilestoneCreateModal';
import MilestoneDetailsDialog from './MilestoneDialog';
import { apiService } from '@/services/api';

export default function Milestones() {
    const [isOpen, setIsOpen] = useState(false);
    const [milestones, setMilestones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [selectedMilestone, setSelectedMilestone] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        target_value: 0,
        reward_coins: 0,
        milestone_type: '',
        start_time: '',
        end_time: ''
    });

    // Calculate current milestones to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const fetchMilestones = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getMilestones();
            
            if (Array.isArray(response.data)) {
                // Explicitly check the active property
                const activeMilestones = response.data.filter(milestone => {
                    // Convert to boolean if it's a string
                    return milestone.active === true || milestone.active === 'true';
                });
                
                // setMilestones(activeMilestones);
                setMilestones(response.data);
            } else {
                console.error('Invalid response format:', response);
                setError('Invalid data format received');
            }
        } catch (error) {
            console.error('Error fetching milestones:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    // Get current milestones after filtering
    const currentMilestones = milestones.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        fetchMilestones();
    }, []);
    
    return (
        (<Layout>
            <div className="fixed-container">
                {/* Header */}
                <div className="">
                    <div className="page-header flex justify-between items-center">
                        <h1>MILESTONES</h1>
                        <Button 
                            onPress={() => setIsOpen(true)} 
                            className="add-button"
                            disabled={isLoading}
                        >
                            <Plus size={20} />
                            Add New Milestone
                        </Button>
                    </div>
                </div>

                {/* Error State */}
                <div>
                    {error && (
                        <Alert color="danger" title={error}/>
                    )}
                </div>
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : (
                    /* Milestones Grid */
                    (<div className="flex-1 overflow-y-auto">
                        
                        <div className="p-6">
                            <div className="grid lg:grid-cols-3 gap-4 ">
                                {currentMilestones.map((milestone) => (
                                    <div 
                                        key={milestone.id} 
                                        className="border border-gray-900 rounded-xl p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-900 border-gray-900"
                                        onClick={() => {
                                            setSelectedMilestone(milestone);
                                            setIsDetailsOpen(true);
                                        }}
                                    >
                                        <div className="flex flex-col flex-1">
                                            <h3 className="font-semibold mb-2">{milestone.name}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-100">{milestone.description}</p>
                                        </div> 
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-full justify-center">
                            <Pagination 
                                isCompact
                                showControls
                                showShadow 
                                color="primary"
                                page={currentPage}
                                total={Math.ceil(milestones.length / itemsPerPage)}
                                onChange={setCurrentPage} />
                        </div>
                    </div>)
                )}
                
                    
                <MilestoneCreateModal 
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    formData={formData}
                    setFormData={setFormData}
                    isLoading={isLoading}
                    onSuccessfulSubmit={fetchMilestones}
                />
                
                {selectedMilestone && (
                    <MilestoneDetailsDialog
                        isOpen={isDetailsOpen}
                        setIsOpen={setIsDetailsOpen}
                        milestone={selectedMilestone}
                        onEdit={fetchMilestones}
                        onDelete={fetchMilestones}
                    />
                )}
            </div>
        </Layout>)
    );
}