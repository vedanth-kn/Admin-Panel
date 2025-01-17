'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import { Button } from "@nextui-org/react";
import VoucherDialog from './VoucherDialog';
import Image from 'next/image';
import Pagination from '../../components/Pagination';

export default function Vouchers() {
    const [isOpen, setIsOpen] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [formData, setFormData] = useState({
        brand: '',
        title: '',
        description: '',
        discount: 0,
        coins: 0,
        price: '',
        logo1: null,
        logo2: null,
        productImage: null,
        banarImage: null,
        websiteLink: '',
        validUpTo: '',
        terms: [''],
        howToAvail: [''],
    });

    // Calculate current brands to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVouchers= vouchers.slice(indexOfFirstItem, indexOfLastItem);

    
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
              const response = await fetch('/api/vouchers');
              const data = await response.json();
              setVouchers(data.data || []);
            } catch (error) {
              console.error('Error fetching vouchers:', error);
            }
          };

        fetchVouchers();
    }, []);

    const fetchVouchers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/vouchers');
            const data = await response.json();
            if (response.ok) {
                setVouchers(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch vouchers');
            }
        } catch (error) {
            console.error('Error fetching vouchers:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            
            // Handle regular fields
            data.append('brand', formData.brand);
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('discount', formData.discount);
            data.append('coins', formData.coins);
            data.append('price', formData.price);
            data.append('websiteLink', formData.websiteLink);
            data.append('validUpTo', formData.validUpTo);
            
            // Handle file fields
            if (formData.logo1) data.append('logo1', formData.logo1);
            if (formData.logo2) data.append('logo2', formData.logo2);
            if (formData.productImage) data.append('productImage', formData.productImage);
            if (formData.banarImage) data.append('banarImage', formData.banarImage);
            
            // Handle arrays
            formData.terms.forEach((term, index) => {
                if (term.trim()) {
                    data.append(`terms[${index}]`, term);
                }
            });
            
            formData.howToAvail.forEach((item, index) => {
                if (item.trim()) {
                    data.append(`howToAvail[${index}]`, item);
                }
            });

            const response = await fetch('/api/vouchers', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit form');
            }

            await fetchVouchers(); // Refresh the vouchers list
            setIsOpen(false);
            setFormData({
                brand: '',
                title: '',
                description: '',
                discount: 0,
                coins: 0,
                price: '',
                logo1: null,
                logo2: null,
                productImage: null,
                banarImage: null,
                websiteLink: '',
                validUpTo: '',
                terms: [''],
                howToAvail: [''],
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form: ' + error.message);
        }
    };


    return (
        <Layout>
            <div className="fixed top-[110px] left-[280px] right-3 bottom-3 bg-white rounded-[12px] flex flex-col overflow-hidden p-[20]">
                {/* Fixed Header */}
                <div className="">
                    <div className="page-header flex justify-between items-center">
                        <h1>VOUCHERS</h1>
                        <Button 
                            onPress={() => setIsOpen(true)} 
                            className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg"
                            disabled={isLoading}
                        >
                            <Plus size={20} />
                            Add New Voucher
                        </Button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 mx-4 rounded">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : vouchers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        There are no vouchers added yet
                    </div>
                ) : (
                    /* Scrollable Grid Container */
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <div className="grid lg:grid-cols-3 gap-4">
                                {currentVouchers.map((voucher) => (
                                    <div key={voucher.id} className="border border-gray-900 rounded-lg p-4 shadow-sm flex gap-4">
                                        {/* Logo Container */}
                                        <div className="relative w-[120px] h-[120px] flex-shrink-0">
                                            {voucher.logo1 ? (
                                                <Image
                                                    src={`/${voucher.logo1}`}
                                                    alt={voucher.brand}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                                    No Logo
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Content Container */}
                                        <div className="flex flex-col flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{voucher.brand}</h3>
                                            <h4 className="text-md font-medium">{voucher.title}</h4>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{voucher.description}</p>
                                            <div className="mt-auto space-y-2">
                                                <div className="flex gap-2">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                        {voucher.discount}% OFF
                                                    </span>
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                                                        {voucher.coins} Coins
                                                    </span>
                                                </div>
                                                <a 
                                                    href={voucher.websiteLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm block"
                                                >
                                                    View Product
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination */}
                        {/* Pagination */}
                        <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(vouchers.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={vouchers.length}
                    />
                    </div>
                )}
                
                <VoucherDialog 
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </Layout>
    );
}