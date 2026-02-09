/**
 * 🎯 Mock Data for Local Development
 * Use this when developing without MongoDB backend
 */

// Mock Users
export const mockUsers = {
    demo: {
        _id: '507f1f77bcf86cd799439011',
        username: 'demoaccount',
        email: 'demo@myntra.com',
        phone: '9876543210',
        address: '123 Fashion Street, Mumbai, Maharashtra 400001'
    },
    testuser: {
        _id: '507f1f77bcf86cd799439012',
        username: 'testuser',
        email: 'test@example.com',
        phone: '9876543211',
        address: '456 Shopping Mall, Bangalore, Karnataka 560001'
    }
};

// Mock Products
export const mockProducts = [
    {
        _id: '601f1f77bcf86cd799439001',
        name: 'Classic White T-Shirt',
        description: 'Premium quality 100% cotton white t-shirt perfect for casual wear. Comfortable fit, breathable fabric.',
        price: 499,
        quantity: 50,
        category: 'Clothing',
        imageUrl: '👕',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439002',
        name: 'Black Denim Jeans',
        description: 'Stylish black denim jeans with perfect fit. Durable fabric, great for everyday styling.',
        price: 1299,
        quantity: 35,
        category: 'Clothing',
        imageUrl: '👖',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439003',
        name: 'Nike Running Shoes',
        description: 'Professional running shoes with cushioned sole for maximum comfort. Lightweight and breathable.',
        price: 4999,
        quantity: 25,
        category: 'Footwear',
        imageUrl: '👟',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439004',
        name: 'Red Summer Dress',
        description: 'Beautiful red summer dress made from soft cotton fabric. Perfect for parties and casual gatherings.',
        price: 1899,
        quantity: 20,
        category: 'Clothing',
        imageUrl: '👗',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439005',
        name: 'Casual Brown Kurta',
        description: 'Traditional yet modern brown kurta for women. Comfortable fit, perfect for casual occasions.',
        price: 799,
        quantity: 40,
        category: 'Ethnic',
        imageUrl: '👘',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439006',
        name: 'Premium Leather Belt',
        description: 'High-quality leather belt with metal buckle. Versatile accessory that goes with any outfit.',
        price: 599,
        quantity: 60,
        category: 'Accessories',
        imageUrl: '🪡',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439007',
        name: 'Stylish Sunglasses',
        description: 'UV protected sunglasses with trendy frame design. Perfect for beaches and outdoor activities.',
        price: 1299,
        quantity: 45,
        category: 'Accessories',
        imageUrl: '🕶️',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439008',
        name: 'Cotton Socks Pack (5 pairs)',
        description: 'Comfortable cotton socks pack with 5 pairs. Soft, breathable, perfect for all seasons.',
        price: 299,
        quantity: 100,
        category: 'Accessories',
        imageUrl: '🧦',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439009',
        name: 'Formal Blazer',
        description: 'Professional formal blazer with perfect tailoring. Ideal for office and party wear.',
        price: 2499,
        quantity: 22,
        category: 'Clothing',
        imageUrl: '🥾',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439010',
        name: 'iPhone 16 Pro',
        description: 'Latest iPhone 16 Pro with advanced camera system, A18 Pro chip, and stunning display.',
        price: 99999,
        quantity: 15,
        category: 'Electronics',
        imageUrl: '📱',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439011',
        name: 'Wireless Earbuds',
        description: 'Premium wireless earbuds with noise cancellation and 24-hour battery life.',
        price: 3999,
        quantity: 30,
        category: 'Electronics',
        imageUrl: '🎧',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439012',
        name: 'Smartwatch',
        description: 'Feature-rich smartwatch with heart rate monitor, GPS, and fitness tracking.',
        price: 5999,
        quantity: 18,
        category: 'Electronics',
        imageUrl: '⌚',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439013',
        name: 'Women Handbag',
        description: 'Stylish and spacious women handbag made from premium PU material.',
        price: 1999,
        quantity: 28,
        category: 'Accessories',
        imageUrl: '👜',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439014',
        name: 'Blue Hoodie',
        description: 'Cozy blue hoodie perfect for winters. Soft fabric with drawstring and kangaroo pockets.',
        price: 999,
        quantity: 33,
        category: 'Clothing',
        imageUrl: '🧥',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        _id: '601f1f77bcf86cd799439015',
        name: 'Yoga Mat',
        description: 'Premium yoga mat with non-slip surface, perfect for yoga, fitness and meditation.',
        price: 899,
        quantity: 25,
        category: 'Sports',
        imageUrl: '🧘',
        userId: '507f1f77bcf86cd799439011',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    }
];

// Mock Orders
export const mockOrders = [
    {
        _id: '701f1f77bcf86cd799439001',
        userId: '507f1f77bcf86cd799439011',
        totalAmount: 5398,
        status: 'delivered',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25')
    },
    {
        _id: '701f1f77bcf86cd799439002',
        userId: '507f1f77bcf86cd799439011',
        totalAmount: 2198,
        status: 'pending',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
    }
];

// Mock Carts
export const mockCarts = {
    '507f1f77bcf86cd799439011': {
        _id: '801f1f77bcf86cd799439001',
        userId: '507f1f77bcf86cd799439011',
        totalAmount: 0,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    }
};

console.log('✅ Mock data loaded - Local profile initialized');
