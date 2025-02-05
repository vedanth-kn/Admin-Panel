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
    ModalFooter, 
    Textarea 
} from "@heroui/react";
import { Plus, X } from 'lucide-react';
import { apiService } from '@/services/api';

const VOUCHER_TYPES = [
    {label: "Freebies", value: "FREEBIES"},
    {label: "Exclusive Deals", value: "EXCLUSIVE_DEALS"},
    {label: "Gift Voucher", value: "GIFT_VOUCHER"},
];

const VoucherDialog = ({ 
    isOpen, 
    onOpenChange, 
    formData, 
    setFormData, 
    onSuccessfulSubmit,
    editMode = false,
    voucherId = null 
}) => {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [brandOptions, setBrandOptions] = useState([])

    // Initialize form data with empty values if not provided
    useEffect(() => {
        if (!formData) {
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
        }
    }, [formData, setFormData]);

    useEffect(() => {
        const fetchBrands = async () => {
            setIsLoading(true);
            try {
                const response = await apiService.getBrands();
                if(response?.data) {
                    setBrands(response.data)

                    const transformedBrands = response.data.map(brand => ({
                        label: brand.name,
                        value: brand.id.toString()
                    }));
                    setBrandOptions(transformedBrands);
                }

                // Edit mode
                if(editMode && formData?.brand) {
                    const selectBrand = response.data.find(brand => brand.id === formData.brand);
                    if(selectBrand) {
                        setFormData(pre => ({
                            ...pre,
                            brand: selectBrand.id.toString(),
                            brandName: selectBrand.name
                        }))
                    }
                }
            }
            catch (err) {
                setError('Failed to fetch brands: ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBrands();
    }, [editMode] )

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        
        try {
            const formDataToSubmit = {
                id: editMode ? voucherId : undefined,
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
                terms_and_conditions: formData.terms_and_conditions.filter(term => term.trim() !== ''),
                how_to_avail: formData.how_to_avail.filter(item => item.trim() !== ''),
            };
    
            const response = editMode
                ? await apiService.updateVoucher(voucherId, JSON.stringify(formDataToSubmit))
                : await apiService.createVouchers(JSON.stringify(formDataToSubmit));

            if (response.success) {
                onSuccessfulSubmit?.();
                onOpenChange(false);
            }
        } catch (err) {
            setError(err.message);
            console.error(editMode ? 'Voucher update error:' : 'Voucher creation error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            scrollBehavior="inside"
            size='4xl'
            color='primary'
            className='bg-white dark:bg-gray-900'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {editMode ? 'Edit Voucher' : 'Add New Voucher'}
                        </ModalHeader>
                        
                        <ModalBody>
                            <form id="voucherForm" onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="brand" className="block mb-2">Brand Name</Label>
                                        <Autocomplete
                                            id="brand"
                                            className="max-w-xs"
                                            defaultItems={brandOptions}
                                            label="Select a brand"
                                            selectedKey={formData.brand}
                                            onSelectionChange={(value) => {
                                                const selectedBrand = brands.find(b => b.id.toString() === value);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    brand: value,
                                                    brandName: selectedBrand?.name
                                                }));
                                            }}
                                            disabled={isLoading || editMode}
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
                                        <Label htmlFor="name" className="block mb-2">Voucher Name</Label>
                                        <Input
                                            id="name"
                                            label="Enter voucher name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="full_offer_description" className="block mb-2">Full Offer Description</Label>
                                        <Input
                                            id="full_offer_description"
                                            label="Enter full offer description"
                                            value={formData.full_offer_description}
                                            onChange={(e) => setFormData({ ...formData, full_offer_description: e.target.value })}
                                        />
                                    </div>

                                {/* Second Row */} 
                                <div>
                                    <Label htmlFor="pre_offer_description" className="block mb-2">Pre Offer Description</Label>
                                    <Input
                                        id="pre_offer_description"
                                        label="Enter pre offer description"
                                        value={formData.pre_offer_description}
                                        onChange={(e) => setFormData({ ...formData, pre_offer_description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="voucher_url" className="block mb-2">Voucher URL</Label>
                                    <Input
                                        id="voucher_url"
                                        type="url"
                                        label="Enter voucher URL"
                                        value={formData.voucher_url}
                                        onChange={(e) => setFormData({ ...formData, voucher_url: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="start_date_time" className="block mb-2">Start Date Time</Label>
                                    <Input
                                        id="start_date_time"
                                        type="date"
                                        label="Select start date"
                                        value={formData.start_date_time}
                                        onChange={(e) => setFormData({ ...formData, start_date_time: e.target.value })}
                                    />
                                </div>

                                {/* Third Rrow */}
                                <div>
                                    <Label htmlFor="end_date_time" className="block mb-2">End Date Time</Label>
                                    <Input
                                        id="end_date_time"
                                        type="date"
                                        label="Select end date"
                                        value={formData.end_date_time}
                                        onChange={(e) => setFormData({ ...formData, end_date_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="coins_to_redeem" className="block mb-2">Coins to Redeem</Label>
                                    <Input
                                        id="coins_to_redeem"
                                        type="number"
                                        label="Enter number of coins to redeem"
                                        value={formData.coins_to_redeem}
                                        onChange={(e) => setFormData({ ...formData, coins_to_redeem: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="voucher_type" className="block mb-2">Voucher Type</Label>
                                    <Autocomplete
                                        id="voucher_type"
                                        className="max-w-xs"
                                        defaultItems={VOUCHER_TYPES}
                                        label="Select voucher type"
                                        selectedKey={formData.voucher_type}
                                        onSelectionChange={(value) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                voucher_type: value
                                            }));
                                        }}
                                    >
                                        {(item) => (
                                            <AutocompleteItem key={item.value}>
                                                {item.label}
                                            </AutocompleteItem>
                                        )}
                                    </Autocomplete>

                                    {/* <select
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
                                    </select> */}
                                </div>

                                {/* Fourth Rrow */}
                                <div>
                                    <Label htmlFor="productImageUrl" className="block mb-2">Product Image URL</Label>
                                    <Input
                                        id="productImageUrl"
                                        type="url"
                                        label="Enter product URL"
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
                                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg dark:bg-gray-700">
                                                    {index + 1}
                                                </div>

                                                <Textarea 
                                                    className="max-w-xs" 
                                                    value={term}
                                                    onChange={(e) => {
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                        handleTermChange(index, e.target.value);
                                                    }}
                                                />
                                                {/* <textarea
                                                    className="flex-1 px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[40px] resize-none overflow-hidden"
                                                    value={term}
                                                    onChange={(e) => {
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                        handleTermChange(index, e.target.value);
                                                    }}
                                                    rows={1}
                                                    style={{ minHeight: '40px' }}
                                                /> */}
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
                                                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg dark:bg-gray-700">
                                                    {index + 1}
                                                </div>
                                                <Textarea 
                                                    className="max-w-xs" 
                                                    value={item}
                                                    onChange={(e) => {
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                        handleHowToAvailChange(index, e.target.value);
                                                    }}
                                                />
                                                {/* <textarea
                                                    className="flex-1 px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black min-h-[40px] resize-none overflow-hidden"
                                                    value={item}
                                                    onChange={(e) => {
                                                        e.target.style.height = 'auto';
                                                        e.target.style.height = e.target.scrollHeight + 'px';
                                                        handleHowToAvailChange(index, e.target.value);
                                                    }}
                                                    rows={1}
                                                    style={{ minHeight: '40px' }}
                                                /> */}
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
        form="brandForm"
        disabled={submitting}
    >
        {submitting ? 'Submitting...' : editMode ? 'Update Brand' : 'Add Brand'}
    </Button>
</ModalFooter>
</>
)}
</ModalContent>
</Modal>
);
}

export default VoucherDialog;