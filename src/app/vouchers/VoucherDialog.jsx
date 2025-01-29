'use client';
import React, { useState, useEffect } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button } from "@heroui/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X, ChevronDown } from 'lucide-react';
import { apiService } from '@/services/api';

const categories = [
    "FREEBIES", 
    "EXCLUSIVE_DEALS", 
    "GIFT_VOUCHER"];

export default function VoucherDialog({ isOpen, setIsOpen, formData, setFormData, onSuccessfulSubmit }) {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchBrands = async () => {
        try {
            const response = await apiService.getBrands();
            setBrands(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleTermAdd = () => {
        setFormData({
            ...formData,
            terms_and_conditions: [...formData.terms_and_conditions, '']
        });
    };

    const handleTermChange = (index, value) => {
        const newTerms = [...formData.terms_and_conditions];
        newTerms[index] = value;
        setFormData({
            ...formData,
            terms_and_conditions: newTerms
        });
    };

    const handleTermRemove = (index) => {
        const newTerms = formData.terms_and_conditions.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            terms_and_conditions: newTerms
        });
    };
    const handleHowToAvailChange = (index, value) => {
        const newItems = [...formData.how_to_avail];
        newItems[index] = value;
        setFormData({
            ...formData,
            how_to_avail: newItems
        });
    };
    
    const handleHowToAvailAdd = () => {
        setFormData({
            ...formData,
            how_to_avail: [...formData.how_to_avail, '']
        });
    };
    
    const handleHowToAvailRemove = (index) => {
        const newItems = formData.how_to_avail.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            how_to_avail: newItems
        });
    };
    const handleFileChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.files[0]
        });
    };
    const handleBrandChange = (e) => {
        const selectedBrand = brands.find(brand => brand.name === e.target.value);
        if (selectedBrand) {
            setFormData({
                ...formData,
                brand: selectedBrand.id,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        try {
            // Prepare form data as a JavaScript object
            const formDataToSubmit = {
                brand_id: formData.brand,
                name: formData.name,
                full_offer_description: formData.full_offer_description,
                pre_offer_description: formData.pre_offer_description,
                voucher_url: formData.voucher_url,
                start_date_time: formData.start_date_time,
                end_date_time: formData.end_date_time,
                coins_to_redeem: formData.coins_to_redeem,
                voucher_type: formData.voucher_type,
                media_details: [
                    ...(formData.productImageUrl
                        ? [{
                            display_type: 'product_image',
                            file_name: formData.productImageUrl.split('/').pop(),
                            media_url: formData.productImageUrl,
                        }]
                        : []
                    ),
                ],
                terms_and_conditions: [...formData.terms_and_conditions, ''],
                how_to_avail: [...formData.how_to_avail, ''],
            };
    
            // Log the data being sent to the API
            console.log(formDataToSubmit);
            
            // Convert to JSON and send in the request body
            const response = await apiService.createVouchers(JSON.stringify(formDataToSubmit), {});
            
            // Reset form and close dialog
            setFormData({
                brand: '',
                name: '',
                full_offer_description: '',
                pre_offer_description: '',
                voucher_url: '',
                start_date_time: '',
                end_date_time: '',
                coins_to_redeem: '',
                voucher_type: '',
                productImageUrl: '',
                terms_and_conditions: [''],
                how_to_avail: [''],
            });
    
            // Optional callback for parent component to refresh brands
            onSuccessfulSubmit?.();
            
            setIsOpen(false);
        } catch (err) {
            setError(err.message);
            console.error('Voucher creation error:', err);
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
                        <Dialog.Title className="text-xl font-bold">Add New Voucher</Dialog.Title>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form id="voucherForm" onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {/* First Row */}
                                <div>
                                    <Label htmlFor="brand" className="block mb-2">Brand Name</Label>
                                    <div className="relative">
                                        <select
                                            id="brand"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none"
                                            value={formData.brand}
                                            onChange={handleBrandChange}
                                            disabled={isLoading}
                                        >
                                            <option value="">Select a brand</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.name}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                                    </div>
                                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="title" className="block mb-2">Voucher Name</Label>
                                    <input
                                        id="name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Enter Voucher Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="full_offer_description" className="block mb-2">Full Offer Description</Label>
                                    <input
                                        id="full_offer_description"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Enter Full Offer Description"
                                        value={formData.full_offer_description}
                                        onChange={(e) => setFormData({ ...formData, full_offer_description: e.target.value })}
                                    />
                                </div>

                                {/* Second Row */} 
                                <div>
                                    <Label htmlFor="pre_offer_description" className="block mb-2">Pre Offer Description</Label>
                                    <input
                                        id="pre_offer_description"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        placeholder="Enter  Pre Offer Description"
                                        value={formData.pre_offer_description}
                                        onChange={(e) => setFormData({ ...formData, pre_offer_description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="voucher_url" className="block mb-2">Voucher URL</Label>
                                    <input
                                        id="voucher_url"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        type="url"
                                        placeholder="Enter Voucher URL"
                                        value={formData.voucher_url}
                                        onChange={(e) => setFormData({ ...formData, voucher_url: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="start_date_time" className="block mb-2">Start Date Time</Label>
                                    <input
                                        id="start_date_time"
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.start_date_time}
                                        onChange={(e) => setFormData({ ...formData, start_date_time: e.target.value })}
                                    />
                                </div>

                                {/* Third Rrow */}
                                <div>
                                    <Label htmlFor="end_date_time" className="block mb-2">End Date Time</Label>
                                    <input
                                        id="end_date_time"
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.end_date_time}
                                        onChange={(e) => setFormData({ ...formData, end_date_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="coins_to_redeem" className="block mb-2">Coins to Redeem</Label>
                                    <input
                                        id="coins_to_redeem"
                                        type="number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.coins_to_redeem}
                                        onChange={(e) => setFormData({ ...formData, coins_to_redeem: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="voucher_type" className="block mb-2">Voucher Type</Label>
                                    <select
                                        id="voucher_type"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        value={formData.voucher_type}
                                        onChange={(e) => setFormData({ ...formData, voucher_type: e.target.value })}
                                    >
                                        <option value="" disabled>
                                            Select Voucher Type
                                        </option>
                                        <option value="FREEBIES">FREEBIES</option>
                                        <option value="EXCLUSIVE_DEALS">EXCLUSIVE DEALS</option>
                                        <option value="GIFT_VOUCHER">GIFT VOUCHER</option>
                                    </select>
                                </div>

                                {/* Fourth Rrow */}
                                <div>
                                    <Label htmlFor="productImageUrl" className="block mb-2">Product Image URL</Label>
                                    <input
                                        id="productImageUrl"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        type="url"
                                        placeholder="ENter Product Image URL"
                                        value={formData.productImageUrl}
                                        onChange={(e) => setFormData({ ...formData, productImageUrl: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Terms & Conditions */}
                                <div>
                                    <Label className="block mb-2">Terms & Conditions</Label>
                                    <div className="space-y-2">
                                        {formData.terms_and_conditions.map((term, index) => (
                                            <div key={index} className="flex gap-2 relative">
                                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                                    {index + 1}
                                                </div>
                                                <textarea
                                                    className="flex-1 px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[40px] resize-none overflow-hidden"
                                                    value={term}
                                                    onChange={(e) => {
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                        handleTermChange(index, e.target.value);
                                                    }}
                                                    rows={1}
                                                    style={{ minHeight: '40px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1"
                                                    onClick={() => handleTermRemove(index)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            className="mt-2"
                                            onClick={handleTermAdd}
                                        >
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                </div>

                                {/* How to Avail */}
                                <div>
                                    <Label className="block mb-2">How to Avail</Label>
                                    <div className="space-y-2">
                                        {formData.how_to_avail.map((item, index) => (
                                            <div key={index} className="flex gap-2 relative">
                                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg">
                                                    {index + 1}
                                                </div>
                                                <textarea
                                                    className="flex-1 px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[40px] resize-none overflow-hidden"
                                                    value={item}
                                                    onChange={(e) => {
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                        handleHowToAvailChange(index, e.target.value);
                                                    }}
                                                    rows={1}
                                                    style={{ minHeight: '40px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1"
                                                    onClick={() => handleHowToAvailRemove(index)}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            className="mt-2"
                                            onClick={handleHowToAvailAdd}
                                        >
                                            <Plus size={20} />
                                        </Button>
                                    </div>
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
                                form="voucherForm"
                                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Add Voucher'}
                            </Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}