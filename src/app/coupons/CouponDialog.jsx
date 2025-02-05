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

const CouponsModal = ({ 
    isOpen, 
    onOpenChange, 
    formData, 
    setFormData,
    onSuccessfulSubmit
}) => {
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [voucherOptions, setVoucherOptions] = useState([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            setIsLoading(true);
            try {
                const response = await apiService.getVouchers();
                if (response?.data) {
                    setVouchers(response.data);

                    const transformedVouchers = response.data.map(voucher => ({
                        label: voucher.name,
                        value: voucher.id.toString()
                    }));
                    setVoucherOptions(transformedVouchers);
                }
            } catch (err) {
                setError('Failed to fetch vouchers: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        try {
            // Convert comma-separated coupon codes to an array
            const couponCodesArray = formData.coupons_id 
                ? formData.coupons_id.split(',').map(code => code.trim()).filter(code => code !== '')
                : [];

            // Prepare form data as a JavaScript object
            const formDataToSubmit = {
                voucher_id: formData.voucher,
                coupon_codes: couponCodesArray,
            };
    
            // Send the request
            const response = await apiService.creatCoupons(JSON.stringify(formDataToSubmit), {});
            
            // Reset form and close dialog
            if (response.success) {
                onSuccessfulSubmit?.();
                onOpenChange(false);
                setFormData({
                    voucher: '',
                    coupons_id: '',
                });
            }
        } catch (err) {
            setError(err.message);
            console.error('Coupon creation error:', err);
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
            className='bg-white dark:bg-gray-900'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Add New Coupon
                        </ModalHeader>
                        
                        <ModalBody>
                            <form id="couponForm" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="voucher" className="block mb-2">Voucher Name</Label>
                                        <Autocomplete
                                            id="voucher"
                                            className="max-w-xs"
                                            defaultItems={voucherOptions}
                                            label="Select a voucher"
                                            selectedKey={formData.voucher}
                                            onSelectionChange={(value) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    voucher: value
                                                }));
                                            }}
                                            disabled={isLoading}
                                        >
                                            {(item) => (
                                                <AutocompleteItem key={item.value}>
                                                    {item.label}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                    </div>
                                    <div>
                                        <Label htmlFor="coupons_id" className="block mb-2">Coupons IDs (Enter/Paste Comma-separated IDs)</Label>
                                        <Input
                                            id="coupons_id"
                                            type="text"
                                            label="Enter coupon IDs"
                                            value={formData.coupons_id}
                                            onChange={(e) => setFormData({ ...formData, coupons_id: e.target.value })}
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
                                form="couponForm"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Add Coupon'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default CouponsModal;