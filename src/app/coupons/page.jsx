'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import { Button } from "@nextui-org/react";
import CouponDialog from './CouponDialog';
import Image from 'next/image';
import Pagination from '../../components/Pagination';

export default function Coupons() {
    const [isOpen, setIsOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [formData, setFormData] = useState({
        voucher: '',
        coupon_codes: '',
        
    });
    return (
        <Layout>
            <div className="fixed top-[110px] left-[280px] right-3 bottom-3 bg-white rounded-[12px] flex flex-col overflow-hidden p-[20]">
                {/* Fixed Header */}
                <div className="">
                    <div className="page-header flex justify-between items-center">
                        <h1>COUPONS</h1>
                        <Button 
                            onPress={() => setIsOpen(true)} 
                            className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg"
                            disabled={isLoading}
                        >
                            <Plus size={20} />
                            Add New Coupons
                        </Button>
                    </div>
                </div>
                
                <CouponDialog 
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    formData={formData}
                    setFormData={setFormData}
                    isLoading={isLoading}
                />
            </div>
        </Layout>
    );
}