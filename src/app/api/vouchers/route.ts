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

// GET endpoint to fetch all vouchers
export async function GET() {
    try {
        // Read from vouchers.json file
        const vouchersPath = path.join(process.cwd(), 'data/vouchers.json');
        const vouchers = fs.existsSync(vouchersPath) 
            ? JSON.parse(fs.readFileSync(vouchersPath, 'utf8'))
            : [];
            
        return NextResponse.json({
            message: "Vouchers fetched successfully",
            data: vouchers
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: "Error fetching vouchers",
            error: error.message
        }, { status: 500 });
    }
}

// POST endpoint to create a new voucher
export async function POST(request) {
    try {
        const formData = await request.formData();
        
        // Handle file uploads
        const logo1Path = formData.get('logo1') ? await saveFile(formData.get('logo1')) : null;
        const logo2Path = formData.get('logo2') ? await saveFile(formData.get('logo2')) : null;
        const productImagePath = formData.get('productImage') ? await saveFile(formData.get('productImage')) : null;
        const banarImagePath = formData.get('banarImage') ? await saveFile(formData.get('banarImage')) : null;

        // Process terms and howToAvail arrays
        const terms = [];
        const howToAvail = [];
        
        // Extract array data from FormData
        for (const [key, value] of formData.entries()) {
            if (key.startsWith('terms[')) {
                const index = parseInt(key.match(/\[(\d+)\]/)[1]);
                terms[index] = value;
            } else if (key.startsWith('howToAvail[')) {
                const index = parseInt(key.match(/\[(\d+)\]/)[1]);
                howToAvail[index] = value;
            }
        }
        
        const voucherData = {
            id: uuidv4(),
            brand: formData.get('brand'),
            title: formData.get('title'),
            description: formData.get('description'),
            discount: parseFloat(formData.get('discount')) || 0,
            coins: parseInt(formData.get('coins')) || 0,
            price: formData.get('price'),
            logo1: logo1Path,
            logo2: logo2Path,
            productImage: productImagePath,
            banarImage: banarImagePath,
            websiteLink: formData.get('websiteLink'),
            validUpTo: formData.get('validUpTo'),
            terms: terms.filter(Boolean), // Remove empty entries
            howToAvail: howToAvail.filter(Boolean),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _v: 0
        };

        // Save to vouchers.json file
        const vouchersPath = path.join(process.cwd(), 'data/vouchers.json');
        const vouchers = fs.existsSync(vouchersPath) 
            ? JSON.parse(fs.readFileSync(vouchersPath, 'utf8'))
            : [];
            
        vouchers.push(voucherData);
        
        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        fs.writeFileSync(vouchersPath, JSON.stringify(vouchers, null, 2));

        return NextResponse.json({
            message: "Voucher added successfully",
            data: voucherData
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            message: "Error adding voucher",
            error: error.message
        }, { status: 500 });
    }
}