import React, { useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { X, Pencil, Trash2, ExternalLink, Globe } from 'lucide-react';
import { Button } from "@heroui/react";
import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { apiService } from '@/services/api';
import VoucherDialog from './VoucherCreateDialog';

// Reusable components from your friend's version
const DetailSection = ({ title, children, className = "" }) => (
  <div className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg ${className}`}>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
    {children}
  </div>
);

const ListSection = ({ title, items }) => {
  if (!items || items.length === 0) return null;
 
  const processedItems = Array.isArray(items)
    ? items
    : typeof items === 'string'
      ? items.split('\n').filter(Boolean)
      : [];

  return (
    <DetailSection title={title}>
      <div className="space-y-3">
        {processedItems.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
              {index + 1}
            </div>
            <div className="text-gray-700 dark:text-gray-300 pt-1">
              {item}
            </div>
          </div>
        ))}
      </div>
    </DetailSection>
  );
};


const VoucherDetailsDialog = ({ isOpen, setIsOpen, voucher, onEdit, onDelete, brand }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    brand: '',
    name: '',
    full_offer_description: '',
    pre_offer_description: '',
    voucher_url: '',
    start_date_time: '',
    end_date_time: '',
    coins_to_redeem: 0,
    voucher_type: '',
    productImageUrl: '',
    terms_and_conditions: [''],
    how_to_avail: [''],
  });

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Not specified';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error formatting date';
    }
  };

  const getProductUrl = (mediaDetails) => {
    if (!mediaDetails) return '';
    const productMedia = mediaDetails.find(media => media.display_type === 'product_image');
    return productMedia?.media_url || '';
  };

  const handleEditClick = () => {
    const terms = Array.isArray(voucher.terms_and_conditions) 
      ? voucher.terms_and_conditions 
      : typeof voucher.terms_and_conditions === 'string'
        ? voucher.terms_and_conditions.split('\n').filter(Boolean)
        : [''];

    const howToAvail = Array.isArray(voucher.how_to_avail)
      ? voucher.how_to_avail
      : typeof voucher.how_to_avail === 'string'
        ? voucher.how_to_avail.split('\n').filter(Boolean)
        : [''];

    const formData = {
      id: voucher.id || '',
      brand: voucher.brand_id || '',
      name: voucher.name || '',
      full_offer_description: voucher.full_offer_description || '',
      pre_offer_description: voucher.pre_offer_description || '',
      voucher_url: voucher.voucher_url || '',
      start_date_time: voucher.start_date_time || '',
      end_date_time: voucher.end_date_time || '',
      coins_to_redeem: voucher.coins_to_redeem || 0,
      voucher_type: voucher.voucher_type || '',
      terms_and_conditions: terms,
      how_to_avail: howToAvail,
      productImageUrl: getProductUrl(voucher.media_details),
    };
    
    setEditFormData(formData);
    setIsEditMode(true);
  };

  const handleEditSuccess = () => {
    setIsEditMode(false);
    onEdit();
  };

  if (isEditMode) {
    return (
      <VoucherDialog
        isOpen={isEditMode}
        setIsOpen={setIsEditMode}
        formData={editFormData}
        setFormData={setEditFormData}
        isLoading={isLoading}
        onSuccessfulSubmit={handleEditSuccess}
        editMode={true}
        voucherId={voucher.id}
      />
    );
  }

  // Ensure all required data is available
  const voucherData = {
    ...voucher,
    name: voucher?.name || 'Not specified',
    voucher_type: voucher?.voucher_type || 'Not specified',
    coins_to_redeem: voucher?.coins_to_redeem || 0,
    full_offer_description: voucher?.full_offer_description || '',
    pre_offer_description: voucher?.pre_offer_description || '',
    voucher_url: voucher?.voucher_url || '',
    start_date_time: voucher?.start_date_time || 'Not specified',
    end_date_time: voucher?.end_date_time || 'Not specified',
    terms_and_conditions: voucher?.terms_and_conditions || [],
    how_to_avail: voucher?.how_to_avail || [],
    media_details: voucher?.media_details || []
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl w-full max-w-4xl shadow-lg z-50">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Voucher Details
            </Dialog.Title>
            <Dialog.Close className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Dialog.Close>
          </div>

          <div className="max-h-[calc(90vh-12rem)] overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Top Section - Image and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Product Image */}
                
                {getProductUrl(voucher.media_details) && (
                  <Card className="py-4 dark:bg-gray-800">
                    <CardHeader className="pb-0 pt-0 px-4 flex-col items-start">
                      <h4 className="font-bold text-large">Product Image</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        alt={`${voucher.name} product`}
                        className="object-cover rounded-xl"
                        src={getProductUrl(voucher.media_details)}
                        width={270}
                      />
                    </CardBody>
                  </Card>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Brand Name</h4>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{brand?.name || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Coins Required</h4>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{voucherData.coins_to_redeem.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Start Date: </span> <br></br>
                      <span className="font-medium">
                        {formatDate(voucherData.start_date_time)}
                      </span>
                    </div>
                  </div>
                  <a href={voucher.voucher_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-colors">
                    <Globe className="w-4 h-4" />
                    Voucher Link
                  </a>
                </div>

                <div className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Voucher Name</h4>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{voucherData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Voucher Type</h4>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{voucherData.voucher_type}</p>
                      </div>
                    </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">End Date: </span><br></br>
                      <span className="font-medium">
                        {formatDate(voucherData.end_date_time)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              
              {/* Description Section */}
              <Card className='p-2 dark:bg-gray-800'>
                <CardHeader className='text-sm font-medium text-gray-500 mb-[-16] dark:text-gray-400'>Pre-Offer Description:</CardHeader>
                <CardBody className='text-lg '>  
                {voucherData.pre_offer_description}
                </CardBody >
                <CardHeader className='text-sm font-medium text-gray-500 mb-[-16] dark:text-gray-400'>Full Offer Description:</CardHeader>
                <CardBody className='text-lg '>  
                {voucherData.full_offer_description}
                </CardBody>
              </Card>
              <Card className='p-2 dark:bg-gray-800'>
                <ListSection title="Terms and Conditions" items={voucherData.terms_and_conditions} />
              </Card>
              <Card className='p-2 dark:bg-gray-800'>
                <ListSection title="How to Avail" items={voucherData.how_to_avail} />
              </Card>
              </div>
          </div>

          {/* Footer with Edit and Delete buttons */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleEditClick}
                className="px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-lg flex items-center gap-2" 
                disabled={isLoading}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Are you sure you want to deactivate this voucher? It will no longer be visible in the vouchers list.')) {
                    setIsLoading(true);
                    apiService.softDeleteVoucher(voucher.id)
                      .then(response => {
                        if (response.success) {
                          onDelete();
                          setIsOpen(false);
                        } else {
                          throw new Error(response.errorMessage || 'Failed to deactivate voucher');
                        }
                      })
                      .catch(error => {
                        console.error('Error deactivating voucher:', error);
                      })
                      .finally(() => setIsLoading(false));
                  }
                }}
                className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg flex items-center gap-2"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default VoucherDetailsDialog;