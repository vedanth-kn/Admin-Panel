import React, { useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { Globe, X, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, Image, CardBody, Button } from "@heroui/react";
import { apiService } from '@/services/api';
import MilestoneCreateModal from './MilestoneCreateModal';

const MilestoneDetailsDialog = ({ isOpen, setIsOpen, milestone, onEdit, onDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    target_value: 0,
    reward_coins: 0,
    milestone_type: '',
    start_time: '',
    end_time: ''
  });

  const handleEditClick = () => {
    // Prepare form data for editing
    const formData = {
      id: milestone.id,
      name: milestone.name,
      description: milestone.description,
      target_value: milestone.target_value,
      reward_coins: milestone.reward_coins,
      milestone_type: milestone.milestone_type,
      start_time: milestone.start_time,
      end_time: milestone.end_time,
    };
    
    setEditFormData(formData);
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to deactivate this Milestone? It will no longer be visible in the Milestone list.')) {
      setIsLoading(true);
      try {
        const response = await apiService.softDeleteMilestone(milestone.id);
        
        if (response.success) {
          onDelete();
          setIsOpen(false);
        } else {
          throw new Error(response.errorMessage || 'Failed to deactivate Milestone');
        }
      } catch (error) {
        console.error('Error deactivating Milestone:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditSuccess = () => {
    setIsEditMode(false);
    onEdit();
  };

  // Render edit dialog if in edit mode
  if (isEditMode) {
    return (
      <MilestoneCreateModal
        isOpen={isEditMode}
        setIsOpen={setIsEditMode}
        formData={editFormData}
        setFormData={setEditFormData}
        isLoading={isLoading}
        onSuccessfulSubmit={handleEditSuccess}
        editMode={true}
        MilestoneId={milestone.id}
      />
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl shadow-lg flex flex-col max-h-[90vh] z-50">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Milestone Details
            </Dialog.Title>
            <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100">
            <div className="flex flex-col gap-8">
              
              {/* Basic Info */}
              <div className="flex justify-between items-center">
              <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                  <p className="mt-1 text-lg dark:text-gray-100">{milestone.name}</p>
                </div>
              </div>

              {/* Description */}
              <div className='pb-4'>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{milestone.description}</p>
              </div>
            </div>
            {/* Footer */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-6 items-center">
            <Button 
              onClick={handleEditClick}
              className="px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-lg flex items-center gap-2" 
              disabled={isLoading}
            >
              <Pencil size={16} />
              Edit
            </Button>
            <Button 
              onClick={handleDelete} 
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg flex items-center gap-2" 
              disabled={isLoading}
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MilestoneDetailsDialog;