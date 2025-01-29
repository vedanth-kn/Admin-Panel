'use client';
import React, {useState, useEffect} from 'react';
import { Label } from "@radix-ui/react-label";
import { Button } from "@heroui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown } from 'lucide-react';
import { apiService } from '@/services/api';

export default function CouponsDialog({ isOpen, setIsOpen, formData, setFormData}) {
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchVouchers = async () => {
        try {
            const response = await apiService.getVouchers();
            setVouchers(response.data);
        } catch (error) {
            setError(error.message);
        }
    };
    
    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleVoucherChange = (e) => {
        const selectedVouchers = vouchers.find(vouchers => vouchers.name === e.target.value);
        if (selectedVouchers) {
            setFormData({
                ...formData,
                voucher: selectedVouchers.id,
            });
        }
    };

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
    
            // Log the data being sent to the API
            console.log(formDataToSubmit);
            
            // Send the request
            const response = await apiService.creatCoupons(JSON.stringify(formDataToSubmit), {});
            
            // Reset form and close dialog
            setFormData({
                voucher: '',
                coupons_id: '',
            });
            
            setIsOpen(false);
        } catch (err) {
            setError(err.message);
            console.error('Coupon creation error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-full max-w-4xl flex flex-col h-[90vh]" style={{ zIndex: 50 }}>
                    {/* Fixed Header */}
                    <div className="p-6 border-b">
                        <Dialog.Title className="text-xl font-bold">Add New Coupon</Dialog.Title>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="couponForm" onSubmit={handleSubmit} className="space-y-4">
                            {/* First Row */}
                        <div className="grid grid-cols-1">
                        <div>
                                <Label htmlFor="voucher" className="block mb-2">Voucher Name</Label>
                                <div className="relative">
                                    <select
                                        id="voucher"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                                        value={formData.vouchers}
                                        onChange={handleVoucherChange}
                                        disabled={isLoading}
                                    >
                                        <option value="">Select a voucher</option>
                                        {vouchers.map((voucher) => (
                                            <option key={voucher.id} value={voucher.name}>
                                                {voucher.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                                </div>
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-1">
                            <div>
                                <Label htmlFor="coupons_id" className="block mb-2">Coupons Id's (Enter/Paste Comma separated Id's)</Label>
                                <input
                                    id="coupons_id"
                                    type="string"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Id's"
                                    value={formData.coupons_id}
                                    onChange={(e) => setFormData({ ...formData, coupons_id: e.target.value })}
                                />
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
                                form="couponForm"
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Add Coupon'}
                            </Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}