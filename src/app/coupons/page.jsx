'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import { Button } from "@heroui/react";
import CouponDialog from './CouponDialog';

export default function Coupons() {
    const [isOpen, setIsOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [formData, setFormData] = useState({
        voucher: '',
        coupon_codes: [''],
        
    });
    return (
        <Layout>
            <div className="container">
                {/* Fixed Header */}
                <div className="">
                    <div className="page-header flex justify-between items-center">
                        <h1>COUPONS</h1>
                        <Button 
                            onPress={() => setIsOpen(true)} 
                            className="add-button"
                            disabled={isLoading}
                        >
                            <Plus size={20} />
                            Add New Coupons
                        </Button>
                    </div>
                </div>
                
                <CouponDialog 
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                    formData={formData}
                    setFormData={setFormData}
                    isLoading={isLoading}
                />
            </div>
        </Layout>
    );
}