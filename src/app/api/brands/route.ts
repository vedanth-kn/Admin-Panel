// app/api/brands/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Helper function to save uploaded file
async function saveFile(file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    return `uploads/${fileName}`;
}

// GET endpoint to fetch all brands
export async function GET() {
    try {
        // In a real app, this would be a database query
        const brandsPath = path.join(process.cwd(), 'data/brands.json');
        const brands = fs.existsSync(brandsPath) 
            ? JSON.parse(fs.readFileSync(brandsPath, 'utf8'))
            : [];
            
        return NextResponse.json({
            message: "Brands fetched successfully",
            data: brands
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching brands",
            error: error.message
        }, { status: 500 });
    }
}

// POST endpoint to create a new brand
export async function POST(request) {
    try {
        const formData = await request.formData();
        const image = formData.get('image');
        
        // Save image and get path
        const imagePath = image ? await saveFile(image) : null;
        
        const brandData = {
            id: uuidv4(),
            name: formData.get('name'),
            description: formData.get('description'),
            website_url: formData.get('website_url'),
            business_category: formData.get('business_category'),
            image: imagePath,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _v: 0
        };

        // In a real app, this would be a database operation
        const brandsPath = path.join(process.cwd(), 'data/brands.json');
        const brands = fs.existsSync(brandsPath) 
            ? JSON.parse(fs.readFileSync(brandsPath, 'utf8'))
            : [];
            
        brands.push(brandData);
        
        // Ensure directory exists
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        fs.writeFileSync(brandsPath, JSON.stringify(brands, null, 2));

        return NextResponse.json({
            message: "Brand added successfully",
            data: brandData
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            message: "Error adding brand",
            error: error.message
        }, { status: 500 });
    }
}