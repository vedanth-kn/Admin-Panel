'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus, Globe } from 'lucide-react';
import {Alert, Button, Pagination} from "@heroui/react";
import MilestoneCreateDialog from './MilestoneCreateDialog';
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
                                            <div className="mt-auto space-y-2">
                                                <span className="bg-blue-100 mb-2 text-blue-800 px-2 py-1 rounded-full text-sm inline-block">
                                                    {milestone.business_category}
                                                </span><br></br>
                                                {milestone.website_url && (
                                                    <a href={milestone.website_url} target="_blank"className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-colors">
                                                        <Globe className="w-4 h-4" />
                                                        Visit Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {getLogoUrl(milestone.media_details) && (
                                            <div className="w-32 flex items-center justify-center flex-shrink-0">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative w-32 h-32">
                                                        <img
                                                            src={getLogoUrl(milestone.media_details)}
                                                            alt={`${milestone.name} logo`}
                                                            className="absolute inset-0 w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
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
                
                    
                <MilestoneCreateDialog 
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
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