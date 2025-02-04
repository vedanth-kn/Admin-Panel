import React, { useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { Globe, X, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, Image, CardBody, Button } from "@heroui/react";
import { apiService } from '@/services/api';
import BrandDialog from './MilestoneCreateDialog';

const MilestoneDetailsDialog = ({ isOpen, setIsOpen, brand, onEdit, onDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    description: '',
    website_url: '',
    business_category: '',
    logoUrl: '',
    bannerUrl: '',
    brandImageUrl: ''
  });
  
  // Helper functions for media URLs
  const getLogoUrl = (mediaDetails) => {
    const logoMedia = mediaDetails?.find(media => media.display_type === 'logo');
    return logoMedia?.media_url || null;
  };

  const getBrandUrl = (mediaDetails) => {
    const brandMedia = mediaDetails?.find(media => media.display_type === 'brand_image');
    return brandMedia?.media_url || null;
  };

  const getBannerUrl = (mediaDetails) => {
    const bannerMedia = mediaDetails?.find(media => media.display_type === 'banner');
    return bannerMedia?.media_url || null;
  };

  const handleEditClick = () => {
    // Prepare form data for editing
    const formData = {
      id: brand.id,
      name: brand.name,
      description: brand.description,
      website_url: brand.website_url,
      business_category: brand.business_category,
      logoUrl: getLogoUrl(brand.media_details),
      bannerUrl: getBannerUrl(brand.media_details),
      brandImageUrl: getBrandUrl(brand.media_details),
    };
    
    setEditFormData(formData);
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to deactivate this brand? It will no longer be visible in the brands list.')) {
      setIsLoading(true);
      try {
        const response = await apiService.softDeleteBrand(brand.id);
        
        if (response.success) {
          onDelete();
          setIsOpen(false);
        } else {
          throw new Error(response.errorMessage || 'Failed to deactivate brand');
        }
      } catch (error) {
        console.error('Error deactivating brand:', error);
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
      <BrandDialog
        isOpen={isEditMode}
        setIsOpen={setIsEditMode}
        formData={editFormData}
        setFormData={setEditFormData}
        isLoading={isLoading}
        onSuccessfulSubmit={handleEditSuccess}
        editMode={true}
        brandId={brand.id}
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
              Brand Details
            </Dialog.Title>
            <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100">
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6">

                {/* Logo */}
                {getLogoUrl(brand.media_details) && (
                  <Card className="py-4 dark:bg-gray-800">
                    <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
                      <h4 className="font-bold text-large">Logo</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        alt={`${brand.name} logo`}
                        className="object-cover rounded-xl"
                        src={getLogoUrl(brand.media_details)}
                        width={270}
                      />
                    </CardBody>
                  </Card>
                )}

                {/* Brand */}
                {getBrandUrl(brand.media_details) && (
                  <Card className="py-4 dark:bg-gray-800">
                    <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
                      <h4 className="font-bold text-large">Brand</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        alt={`${brand.name} Brand`}
                        className="object-cover rounded-xl"
                        src={getBrandUrl(brand.media_details)}
                        width={270}
                      />
                    </CardBody>
                  </Card>
                )}

                {/* Banner */}
                {getBannerUrl(brand.media_details) && (
                  <Card className="py-4 dark:bg-gray-800">
                    <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
                      <h4 className="font-bold text-large">Banner</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        alt={`${brand.name} Banner`}
                        className="object-cover rounded-xl"
                        src={getBannerUrl(brand.media_details)}
                        width={270}
                      />
                    </CardBody>
                  </Card>
                )}
              </div>
              {/* Basic Info */}
              <div className="flex justify-between items-center">
              <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                  <p className="mt-1 text-lg dark:text-gray-100">{brand.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Category</h3>
                  <span className="font-bold dark:text-gray-100">
                    {brand.business_category}
                  </span>
                </div>
                <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-colors">
                  <Globe className="w-4 h-4" />
                  Visit Website
                </a>
              </div>

              {/* Description */}
              <div className='pb-4'>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Description</h3>
                <p className="text-gray-800 dark:text-gray-100 leading-relaxed">{brand.description}</p>
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