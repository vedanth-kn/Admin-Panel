'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import { Button } from "@nextui-org/react";
import BrandDialog from './BrandDialog';
import Image from 'next/image';
import Pagination from '../../components/Pagination';

export default function Brands() {
    const [isOpen, setIsOpen] = useState(false);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);

    // Calculate current brands to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website_url: '',
        business_category: '', // Fixed typo
        image: null,
    });

    useEffect(() => {
        const fetchBrands = async () => {
            try {
              const response = await fetch('/api/brands');
              const data = await response.json();
              setBrands(data.data || []);
            } catch (error) {
              console.error('Error fetching brands:', error);
            }
          };

        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/brands');
            const data = await response.json();
            if (response.ok) {
                setBrands(data.data);
            } else {
                throw new Error(data.message || 'Failed to fetch brands');
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            const response = await fetch('/api/brands', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                throw new Error('Failed to add brand');
            }

            setIsOpen(false);
            setFormData({
                name: '',
                description: '',
                website_url: '',
                business_category: '',
                image: null,
            });
            await fetchBrands();
        } catch (error) {
            console.error('Error adding brand:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="fixed top-[110px] left-[280px] right-3 bottom-3 bg-white rounded-[12px] flex flex-col overflow-hidden p-[20]">
                {/* Fixed Header */}
                <div className="">
                    <div className="page-header flex justify-between items-center">
                        <h1>BRANDS</h1>
                        <Button 
                            onPress={() => setIsOpen(true)} 
                            className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg"
                            disabled={isLoading}
                        >
                            <Plus size={20} />
                            Add New Brand
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
                        <div className="p-6 ">
                            <div className="grid lg:grid-cols-3 gap-4">
                                {currentBrands.map((brand) => (
                                    <div key={brand.id} className="border border-gray-900 rounded-lg p-4 shadow-sm flex gap-4">
                                        {/* Image Container */}
                                        <div className="relative w-[120px] h-[120px] flex-shrink-0">
                                            {brand.image ? (
                                                <Image
                                                    src={`/${brand.image}`}
                                                    alt={brand.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Content Container */}
                                        <div className="flex flex-col flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{brand.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{brand.description}</p>
                                            <div className="mt-auto space-y-2">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm inline-block">
                                                    {brand.business_category}
                                                </span>
                                                <a 
                                                    href={brand.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-sm block"
                                                >
                                                    Visit Website
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Pagination */}
                        <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(brands.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={brands.length}
                    />
                    </div>
                )}
                
                <BrandDialog 
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