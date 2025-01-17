import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'coupons.json');
        
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const couponsArray = JSON.parse(fileContent);
        
        // Transform the array into the expected format
        const response = { coupons: couponsArray };
        
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error reading coupons:', error);
        return NextResponse.json(
            { coupons: [] }, // Return empty coupons array instead of error
            { status: 200 }  // Return 200 even if there's an error
        );
    }
}

export async function PUT(request) {
    try {
        const { index, newName } = await request.json();
        const filePath = path.join(process.cwd(), 'data', 'coupons.json');
        
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const couponsArray = JSON.parse(fileContent);
        
        if (index >= 0 && index < couponsArray.length) {
            couponsArray[index].coupon_name = newName;
            await fs.writeFile(filePath, JSON.stringify(couponsArray, null, 2));
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { error: 'Invalid coupon index' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error updating coupon:', error);
        return NextResponse.json(
            { error: 'Failed to update coupon: ' + error.message },
            { status: 500 }
        );
    }
}