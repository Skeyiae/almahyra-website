export interface Variant {
    id: string;
    label: string;
    color: string;
    image: string;
    category?: "Standard" | "Premium";
}

export interface Model {
    id: string;
    propertyId: string; // Link to specific property
    name: string;
    description: string;
    variants: Variant[];
    category?: "Standard" | "Premium";
}

export interface Unit {
    id: string; // Kavling No (e.g., "A-01")
    propertyId: string; // Link to property (e.g., "griya-keiko")
    type: string; // Type 36, 45, etc
    price: string; // Price in text or number
    status: "Available" | "Sold" | "Booked"; // Current status
    features: string[]; // ["2 Kamar", "1 Kamar Mandi", etc]
}
