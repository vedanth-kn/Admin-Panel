import React from 'react';
import { Coins } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Divider, Image } from '@heroui/react';

const VoucherCard = ({ voucher, brand }) => {
    const getLogo = (mediaDetails) => {
        const logoMedia = mediaDetails?.find(media => media.display_type === "logo");
        return logoMedia?.media_url || null;
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex gap-3">
                <div className="w-10 h-10 flex-shrink-0">
                    {brand?.media_details ? (
                        <Image
                            alt={`${brand.name} logo`}
                            height={40}
                            radius="sm"
                            src={getLogo(brand.media_details) || '/api/placeholder/40/40'}
                            width={40}
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
            
            <Divider />
            
            <CardBody>
                <h3 className="text-lg font-semibold mb-2">{voucher.name}</h3>
                <p className="text-gray-600 text-sm mb-clamp-2 dark:text-gray-100">
                    {voucher.pre_offer_description}
                </p>
            </CardBody>
            
            <CardFooter>
                <div className="mt-auto space-y-2">
                    <span className="bg-blue-100 mb-2 text-blue-800 px-2 py-1 rounded-full text-sm inline-flex items-center">
                        <Coins className="pr-1.5" />
                        {voucher.coins_to_redeem}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
};

export default VoucherCard;