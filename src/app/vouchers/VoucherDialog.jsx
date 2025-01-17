'use client';
import React, { useState, useEffect } from 'react';
import { Label } from "@radix-ui/react-label";
import { Button } from "@nextui-org/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X, ChevronDown } from 'lucide-react';

export default function VoucherDialog({ isOpen, setIsOpen, formData, setFormData, handleSubmit }) {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);

    const handleBrandInputChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, brand: value });

        // Filter brands based on input
        const filtered = brands.filter((brand) =>
            brand.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBrands(filtered);
        setShowBrandDropdown(value !== "" && filtered.length > 0);
    };

    const handleBrandSelect = (brand) => {
        setFormData({
            ...formData,
            brand: brand.name,
            websiteLink: brand.website_url || '',
        });
        setShowBrandDropdown(false);
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/brands');
            const data = await response.json();
            if (response.ok) {
                setBrands(data.data || []);
            } else {
                throw new Error(data.message || 'Failed to fetch brands');
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            setError('Failed to load brands');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTermAdd = () => {
        setFormData({
            ...formData,
            terms: [...formData.terms, '']
        });
    };

    const handleTermChange = (index, value) => {
        const newTerms = [...formData.terms];
        newTerms[index] = value;
        setFormData({
            ...formData,
            terms: newTerms
        });
    };

    const handleTermRemove = (index) => {
        const newTerms = formData.terms.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            terms: newTerms
        });
    };
    const handleHowToAvailChange = (index, value) => {
        const newItems = [...formData.howToAvail];
        newItems[index] = value;
        setFormData({
            ...formData,
            howToAvail: newItems
        });
    };
    
    const handleHowToAvailAdd = () => {
        setFormData({
            ...formData,
            howToAvail: [...formData.howToAvail, '']
        });
    };
    
    const handleHowToAvailRemove = (index) => {
        const newItems = formData.howToAvail.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            howToAvail: newItems
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
                brand: selectedBrand.name,
                websiteLink: selectedBrand.website_url || '',
            });
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
                        {/* First Row */}
                        <div className="grid grid-cols-3 gap-4">
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
                                <Label htmlFor="title" className="block mb-2">Title</Label>
                                <input
                                    id="title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description" className="block mb-2">Description</Label>
                                <input
                                    id="description"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="discount" className="block mb-2">Discount</Label>
                                <input
                                    id="discount"
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="0"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="coins" className="block mb-2">Coins</Label>
                                <input
                                    id="coins"
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="0"
                                    value={formData.coins}
                                    onChange={(e) => setFormData({ ...formData, coins: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="price" className="block mb-2">Price</Label>
                                <input
                                    id="price"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Non"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Third Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="logo1" className="block mb-2">Logo 1</Label>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        type="button"
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                                        onClick={() => document.getElementById('logo1').click()}
                                    >
                                        Choose
                                    </Button>
                                    <input
                                        id="logo1"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange('logo1')}
                                    />
                                    <span className="truncate">{formData.logo1?.name || ''}</span>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="logo2" className="block mb-2">Logo 2</Label>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        type="button"
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                                        onClick={() => document.getElementById('logo2').click()}
                                    >
                                        Choose
                                    </Button>
                                    <input
                                        id="logo2"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange('logo2')}
                                    />
                                    <span className="truncate">{formData.logo2?.name || ''}</span>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="productImage" className="block mb-2">Product Image</Label>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        type="button"
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                                        onClick={() => document.getElementById('productImage').click()}
                                    >
                                        Choose
                                    </Button>
                                    <input
                                        id="productImage"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange('productImage')}
                                    />
                                    <span className="truncate">{formData.productImage?.name || ''}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fourth Row */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="banarImage" className="block mb-2">Banar Image</Label>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        type="button"
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
                                        onClick={() => document.getElementById('banarImage').click()}
                                    >
                                        Choose
                                    </Button>
                                    <input
                                        id="banarImage"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange('banarImage')}
                                    />
                                    <span className="truncate">{formData.banarImage?.name || ''}</span>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="websiteLink" className="block mb-2">Website Link</Label>
                                <input
                                    id="websiteLink"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="Link"
                                    value={formData.websiteLink}
                                    onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="validUpTo" className="block mb-2">Valid up to</Label>
                                <input
                                    id="validUpTo"
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    value={formData.validUpTo}
                                    onChange={(e) => setFormData({ ...formData, validUpTo: e.target.value })}
                                />
                            </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Terms & Conditions */}
                                <div>
                                    <Label className="block mb-2">Terms & Conditions</Label>
                                    <div className="space-y-2">
                                        {formData.terms.map((term, index) => (
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
                                        {formData.howToAvail.map((item, index) => (
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
                            >
                                Save Voucher
                            </Button>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}