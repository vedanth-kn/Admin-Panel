'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import VoucherDialog from './VoucherCreateDialog';
import Pagination from '../../components/Pagination';
import VoucherDetailsDialog from './VoucherDetailsDialog';
import { apiService } from '@/services/api';
import VoucherCard from './VoucherCard';
import { Button } from '@heroui/react';

export default function Vouchers() {
    // State management with proper initialization
    const [state, setState] = useState({
        isOpen: false,
        vouchers: [],
        isLoading: true,
        error: null,
        currentPage: 1,
        itemsPerPage: 9,
        selectedVoucher: null,
        isDetailsOpen: false,
        brands: {},
    });

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

    // Calculate pagination
    const indexOfLastItem = state.currentPage * state.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - state.itemsPerPage;
    const currentVouchers = state.vouchers.slice(indexOfFirstItem, indexOfLastItem);

    // Data fetching with proper error handling
    const fetchData = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true }));
            const [vouchersResponse, brandsResponse] = await Promise.all([
                apiService.getVouchers(),
                apiService.getBrands()
            ]);

            const brandsObj = brandsResponse.data.reduce((acc, brand) => {
                acc[brand.id] = brand;
                return acc;
            }, {});

            setState(prev => ({
                ...prev,
                vouchers: vouchersResponse.data,
                brands: brandsObj,
                isLoading: false,
                error: null
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message,
                isLoading: false
            }));
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Layout>
            <div className="fixed-container">
                <div className="page-header flex justify-between items-center p-">
                    <h1 className="font-bold">VOUCHERS</h1>
                    <Button
                        onClick={() => setState(prev => ({ ...prev, isOpen: true }))}
                        disabled={state.isLoading}
                        className="flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add New Voucher
                    </Button>
                </div>

                {state.error && (
                    <div className="p-4 bg-red-50 text-red-600 mx-4 rounded">
                        {state.error}
                    </div>
                )}

                {state.isLoading ? (
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <div className="grid lg:grid-cols-3 gap-4">
                                {currentVouchers.map((voucher) => (
                                    <div
                                        key={voucher.id}
                                        onClick={() => setState(prev => ({
                                            ...prev,
                                            selectedVoucher: voucher,
                                            isDetailsOpen: true
                                        }))}
                                        className="cursor-pointer"
                                    >
                                        <VoucherCard
                                            voucher={voucher}
                                            brand={state.brands[voucher.brand_id]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Pagination
                            currentPage={state.currentPage}
                            totalPages={Math.ceil(state.vouchers.length / state.itemsPerPage)}
                            onPageChange={(page) => setState(prev => ({ ...prev, currentPage: page }))}
                            itemsPerPage={state.itemsPerPage}
                            totalItems={state.vouchers.length}
                        />
                    </div>
                )}

                <VoucherDialog
                    isOpen={state.isOpen}
                    setIsOpen={(isOpen) => setState(prev => ({ ...prev, isOpen }))}
                    formData={formData}
                    setFormData={setFormData}
                    onSuccessfulSubmit={fetchData}
                    isLoading={state.isLoading}
                />

                {state.selectedVoucher && (
                    <VoucherDetailsDialog
                        isOpen={state.isDetailsOpen}
                        setIsOpen={(isOpen) => setState(prev => ({ ...prev, isDetailsOpen: isOpen }))}
                        voucher={state.selectedVoucher}
                        onEdit={fetchData}
                        onDelete={fetchData}
                    />
                )}
            </div>
        </Layout>
    );
}