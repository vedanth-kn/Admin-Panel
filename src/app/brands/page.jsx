'use client';
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus, Globe } from 'lucide-react';
import {Alert, Button, Pagination} from "@heroui/react";
import BrandDialog from './BrandCreateDialog';
import BrandDetailsDialog from './BrandDetailsDialog';
// import Pagination from '../../components/Pagination';
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
    const [page, setPage] = React.useState(1);

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
        (<Layout>
            <div className="fixed-container">
                {/* Header */}
                <div className="">
                    <div className="page-header flex justify-between items-center">
                        <h1>BRANDS</h1>
                        <Button 
                            onPress={() => setIsOpen(true)} 
                            className="add-button"
                            disabled={isLoading}
                        >
                            <Plus size={20} />
                            Add New Brand
                        </Button>
                    </div>
                </div>

                {/* Error State */}
                <div>
                    {error && (
                        <Alert color="danger" title={error}/>
                    )}
                </div>
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    </div>
                ) : (
                    /* Brands Grid */
                    (<div className="flex-1 overflow-y-auto">
                        
                        <div className="p-6">
                            <div className="grid lg:grid-cols-3 gap-4 ">
                                {currentBrands.map((brand) => (
                                    <div 
                                        key={brand.id} 
                                        className="border border-gray-900 rounded-xl p-4 shadow-sm flex gap-4 cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-900 border-gray-900"
                                        onClick={() => {
                                            setSelectedBrand(brand);
                                            setIsDetailsOpen(true);
                                        }}
                                    >
                                        <div className="flex flex-col flex-1">
                                            <h3 className="font-semibold mb-2">{brand.name}</h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-100">{brand.description}</p>
                                            <div className="mt-auto space-y-2">
                                                <span className="bg-blue-100 mb-2 text-blue-800 px-2 py-1 rounded-full text-sm inline-block">
                                                    {brand.business_category}
                                                </span><br></br>
                                                {brand.website_url && (
                                                    <a href={brand.website_url} target="_blank"className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-colors">
                                                        <Globe className="w-4 h-4" />
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
                        {/* <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(brands.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={brands.length}
                        /> */}
                    </div>)
                )}
                <div className="flex w-full justify-center">
                    <Pagination 
                        isCompact
                        showControls
                        showShadow 
                        color="primary"
                        page={currentPage} total={Math.ceil(brands.length / itemsPerPage)}
                        onChange={setCurrentPage} />
                </div>
                    
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
        </Layout>)
    );
}