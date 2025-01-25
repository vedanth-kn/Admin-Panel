'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import { Button } from "@nextui-org/react";
import VoucherDialog from './VoucherDialog';
import Image from 'next/image';
import Pagination from '../../components/Pagination';
import VoucherDetailsDialog from './VoucherDetailsDialog'
import { apiService } from '@/services/api';

export default function Vouchers() {
    const [isOpen, setIsOpen] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [formData, setFormData] = useState({
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

    // Calculate current vouchers to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVouchers= vouchers.slice(indexOfFirstItem, indexOfLastItem);

    
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
                ) : (
                    /* Scrollable Grid Container */
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <div className="grid lg:grid-cols-3 gap-4">
                                {currentVouchers.map((vouchers) => (
                                    <div 
                                        key={vouchers.id} 
                                        className="border border-gray-900 rounded-lg p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => {
                                            setSelectedBrand(brand);
                                            setIsDetailsOpen(true);
                                        }}
                                    >
                                        <div className="flex flex-col flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{vouchers.name}</h3>
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
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
                    onSuccessfulSubmit={fetchVouchers}
                    isLoading={isLoading}
                />

                {selectedVoucher && (
                    <VoucherDetailsDialog
                        isOpen={isDetailsOpen}
                        setIsOpen={setIsDetailsOpen}
                        voucher={selectedVoucher}
                        onEdit={fetchVouchers}
                        onDelete={fetchVouchers}
                    />
                )}
            </div>
        </Layout>
    );
}