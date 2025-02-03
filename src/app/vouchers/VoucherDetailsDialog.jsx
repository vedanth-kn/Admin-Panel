import React, { useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { X, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from "@heroui/react";
import { Card } from "@heroui/react";
import { apiService } from '@/services/api';
import VoucherDialog from './VoucherCreateDialog';

const DetailSection = ({ title, children, className = "" }) => (
  <div className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg ${className}`}>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
    {children}
  </div>
);

const ListSection = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  
  // Handle both array and string inputs
  const processedItems = Array.isArray(items) 
    ? items 
    : typeof items === 'string' 
      ? items.split('\n').filter(Boolean)
      : [];

  return (
    <DetailSection title={title}>
      <ul className="space-y-2 list-disc pl-5">
        {processedItems.map((item, index) => (
          <li key={index} className="text-gray-700 dark:text-gray-300">{item}</li>
        ))}
      </ul>
    </DetailSection>
  );
};

const VoucherDetailsDialog = ({ isOpen, setIsOpen, voucher, onEdit, onDelete, brand }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Not specified';
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' // Add timezone to ensure consistent display
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Error formatting date';
    }
  };

  const getProductUrl = (mediaDetails) => {
    if (!mediaDetails) return null;
    const productMedia = mediaDetails.find(media => media.display_type === 'product_image');
    return productMedia?.media_url || null;
  };

  // Ensure all required data is available
  const voucherData = {
    ...voucher,
    name: voucher?.name || 'Not specified',
    voucher_type: voucher?.voucher_type || 'Not specified',
    coins_to_redeem: voucher?.coins_to_redeem || 0,
    full_offer_description: voucher?.full_offer_description || '',
    pre_offer_description: voucher?.pre_offer_description || '',
    voucher_url: voucher?.voucher_url || '',
    start_date_time: voucher?.start_date_time || null,
    end_date_time: voucher?.end_date_time || null,
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Image */}
                {getProductUrl(voucherData.media_details) && (
                  <Card className="overflow-hidden">
                    <div className="p-4">
                      <h4 className="font-semibold text-lg mb-4">Product Image</h4>
                      <div className="relative aspect-square w-full">
                        <img
                          alt={`${voucherData.name} product`}
                          src={getProductUrl(voucherData.media_details)}
                          className="object-contain rounded-lg w-full h-full"
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {/* Basic Info */}
                <div className="space-y-4">
                  <DetailSection title="Basic Information">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Brand Name</h4>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{brand?.name || 'Not specified'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Voucher Name</h4>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{voucherData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Voucher Type</h4>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{voucherData.voucher_type}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Coins Required</h4>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{voucherData.coins_to_redeem.toLocaleString()}</p>
                      </div>
                    </div>
                  </DetailSection>
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                {voucherData.full_offer_description && (
                  <DetailSection title="Full Offer Description">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{voucherData.full_offer_description}</p>
                  </DetailSection>
                )}

                {voucherData.pre_offer_description && (
                  <DetailSection title="Pre-Offer Description">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{voucherData.pre_offer_description}</p>
                  </DetailSection>
                )}

                {voucherData.voucher_url && (
                  <DetailSection title="Voucher URL">
                    <a
                      href={voucherData.voucher_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2"
                    >
                      {voucherData.voucher_url}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </DetailSection>
                )}

                <DetailSection title="Validity Period">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Start Date: </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatDate(voucherData.start_date_time)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">End Date: </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatDate(voucherData.end_date_time)}
                      </span>
                    </div>
                  </div>
                </DetailSection>

                <ListSection title="Terms and Conditions" items={voucherData.terms_and_conditions} />
                <ListSection title="How to Avail" items={voucherData.how_to_avail} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Are you sure you want to deactivate this voucher?')) {
                    setIsLoading(true);
                    apiService.softDeleteVoucher(voucherData.id)
                      .then(response => {
                        if (response.success) {
                          onDelete();
                          setIsOpen(false);
                        }
                      })
                      .catch(console.error)
                      .finally(() => setIsLoading(false));
                  }
                }}
                className="flex items-center gap-2"
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