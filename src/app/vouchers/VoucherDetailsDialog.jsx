import React, { useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { X, Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, Image, CardBody, Button } from "@heroui/react";
import { apiService } from '@/services/api';
import VoucherDialog from './VoucherCreateDialog';

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

  const getLogo = (mediaDetails) => {
    const logoMedia = mediaDetails?.find(media => media.display_type === "logo");
    return logoMedia?.media_url || null;
  };

  const getProductUrl = (mediaDetails) => {
    const productMedia = mediaDetails?.find(media => media.display_type === 'product_image');
    return productMedia?.media_url || null;
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
      id: voucher.id,
      brand: voucher.brand_id,
      name: voucher.name,
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to deactivate this voucher? It will no longer be visible in the vouchers list.')) {
      setIsLoading(true);
      try {
        const response = await apiService.softDeleteVoucher(voucher.id);
        
        if (response.success) {
          onDelete();
          setIsOpen(false);
        } else {
          throw new Error(response.errorMessage || 'Failed to deactivate voucher');
        }
      } catch (error) {
        console.error('Error deactivating voucher:', error);
      } finally {
        setIsLoading(false);
      }
    }
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

  const termsArray = Array.isArray(voucher.terms_and_conditions)
    ? voucher.terms_and_conditions
    : typeof voucher.terms_and_conditions === 'string'
      ? voucher.terms_and_conditions.split('\n').filter(Boolean)
      : [];

  const howToAvailArray = Array.isArray(voucher.how_to_avail)
    ? voucher.how_to_avail
    : typeof voucher.how_to_avail === 'string'
      ? voucher.how_to_avail.split('\n').filter(Boolean)
      : [];
      
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl shadow-lg flex flex-col max-h-[90vh] z-50">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Voucher Details
            </Dialog.Title>
            <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 text-gray-900 dark:text-gray-100">
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-6">
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
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Brand Name</h3>
                  <p className="mt-1 text-lg dark:text-gray-100">{brand.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">VouchrName</h3>
                  <p className="mt-1 text-lg dark:text-gray-100">{voucher.name}</p>
                </div>
              </div>

              <div className="space-y-6">
                {voucher.full_offer_description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Offer Description</h3>
                    <p className="mt-1 dark:text-gray-100">{voucher.full_offer_description}</p>
                  </div>
                )}

                {voucher.pre_offer_description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preview Description</h3>
                    <p className="mt-1 dark:text-gray-100">{voucher.pre_offer_description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Coins Required</h3>
                  <p className="mt-1 dark:text-gray-100">{voucher.coins_to_redeem || 0}</p>
                </div>

                {(voucher.start_date_time && voucher.end_date_time) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Validity Period</h3>
                    <p className="mt-1 dark:text-gray-100">
                      {new Date(voucher.start_date_time).toLocaleDateString()} - {new Date(voucher.end_date_time).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {termsArray.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Terms and Conditions</h3>
                    <ul className="mt-1 list-disc pl-4 dark:text-gray-100">
                      {termsArray.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {howToAvailArray.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">How to Avail</h3>
                    <ul className="mt-1 list-disc pl-4 dark:text-gray-100">
                      {howToAvailArray.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
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

export default VoucherDetailsDialog;