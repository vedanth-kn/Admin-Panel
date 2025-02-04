import React from 'react';
import { Coins } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from '@heroui/react';

const VoucherCard = ({ voucher, brand }) => {
    const getLogo = (mediaDetails) => {
        const logoMedia = mediaDetails?.find(media => media.display_type === "logo");
        return logoMedia?.media_url || null;
    };

    const getProductUrl = (mediaDetails) => {
        if (!mediaDetails) return '';
        const productMedia = mediaDetails.find(media => media.display_type === 'product_image');
        return productMedia?.media_url || '';
    };

    return (
        <Card className="h-full dark:bg-gray-900">
          <CardHeader className="flex gap-3">
            <div className="w-10 h-10 flex-shrink-0">
              {brand?.media_details ? (
                <img
                  alt={`${brand.name} logo`}
                  className="w-10 h-10 rounded-sm"
                  src={getLogo(brand.media_details)}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/40/40';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-sm dark:bg-gray-700">
                  <span className="text-gray-400 text-xs">No Logo</span>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <p className="text-md">{brand?.name || 'Unknown Brand'}</p>
              <p className="text-small text-default-500">
                {brand?.website_url || 'Website Not Found'}
              </p>
            </div>
          </CardHeader>
    
          <div className="border-t border-gray-200 dark:border-gray-700" />
    
          <CardBody className="flex flex-row gap-4">
            {getProductUrl(voucher.media_details) && (
                <div className="w-24 h-24 flex-shrink-0">
                    <div className="relative w-full h-full">
                        <img
                            src={getProductUrl(voucher.media_details)}
                            alt={`${voucher.name} logo`}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{voucher.name}</h3>
              <p className="text-gray-600 text-sm mb-4 dark:text-gray-100">
                {voucher.pre_offer_description}
              </p>
              <div className="space-y-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm inline-flex items-center">
                  <Coins className="w-4 h-4 mr-1.5" />
                  {voucher.coins_to_redeem}
                </span>
              </div>
            </div>
            
            
          </CardBody>
        </Card>
      );
};

export default VoucherCard;