'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus } from 'lucide-react';
import { Button } from "@nextui-org/react";
import BrandDialog from './BrandDialog';
import BrandDetailsDialog from './BrandDetailsDialog';
import Pagination from '../../components/Pagination';
import { apiService } from '@/services/api';

export default function Brands() {
    const [isOpen, setIsOpen] = useState(false);
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website_url: '',
        business_category: '',
        logoUrl: '',
        bannerUrl: '',
        brandImageUrl: '',
    });

    // Helper function to get logo URL from media_details
    const getLogoUrl = (mediaDetails) => {
        const logoMedia = mediaDetails?.find(media => media.display_type === 'logo');
        return logoMedia?.media_url || null;
    };

    // Calculate current brands to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem);

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
    
    return (
        <Layout>
            <div className="fixed top-[110px] left-[280px] right-3 bottom-3 bg-white rounded-[12px] flex flex-col overflow-hidden p-[20]">
                {/* Header */}
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
                    /* Brands Grid */
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-6">
                            <div className="grid lg:grid-cols-3 gap-4">
                                {currentBrands.map((brand) => (
                                    <div 
                                        key={brand.id} 
                                        className="border border-gray-900 rounded-lg p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => {
                                            setSelectedBrand(brand);
                                            setIsDetailsOpen(true);
                                        }}
                                    >
                                        <div className="flex flex-col flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{brand.name}</h3>
                                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{brand.description}</p>
                                            <div className="mt-auto space-y-2">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm inline-block">
                                                    {brand.business_category}
                                                </span>
                                                {brand.website_url && (
                                                    <a 
                                                        href={brand.website_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline text-sm block"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Visit Website
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {getLogoUrl(brand.media_details) && (
                                            <div className="w-32 flex items-center justify-center flex-shrink-0">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative w-32 h-32">
                                                        <img
                                                            src={getLogoUrl(brand.media_details)}
                                                            alt={`${brand.name} logo`}
                                                            className="absolute inset-0 w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
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
                    isLoading={isLoading}
                    onSuccessfulSubmit={fetchBrands}
                />
                
                {selectedBrand && (
                    <BrandDetailsDialog
                        isOpen={isDetailsOpen}
                        setIsOpen={setIsDetailsOpen}
                        brand={selectedBrand}
                        onEdit={fetchBrands}
                        onDelete={fetchBrands}
                    />
                )}
            </div>
        </Layout>
    );
}