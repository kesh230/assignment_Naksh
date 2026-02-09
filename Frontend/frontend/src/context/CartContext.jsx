import React, { createContext, useCallback, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });
    const [totalAmount, setTotalAmount] = useState(0);
    const [itemCount, setItemCount] = useState(0);

    // Save to localStorage whenever cart changes
    const saveCart = useCallback((items) => {
        localStorage.setItem('cartItems', JSON.stringify(items));
        setCartItems(items);
        
        // Calculate totals
        let total = 0;
        let count = 0;
        items.forEach(item => {
            if (item.productId?.price) {
                total += item.productId.price * item.quantity;
                count += item.quantity;
            }
        });
        setTotalAmount(total);
        setItemCount(count);
    }, []);

    const addToCart = useCallback((product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.productId?._id === product._id);
            let updated;
            
            if (existing) {
                updated = prev.map(item => 
                    item.productId?._id === product._id 
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updated = [...prev, { productId: product, quantity }];
            }
            saveCart(updated);
            return updated;
        });
    }, [saveCart]);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        const updated = cartItems.map(item =>
            item.productId?._id === productId 
                ? { ...item, quantity }
                : item
        );
        saveCart(updated);
    }, [cartItems, saveCart]);

    const removeFromCart = useCallback((productId) => {
        const updated = cartItems.filter(item => item.productId?._id !== productId);
        saveCart(updated);
    }, [cartItems, saveCart]);

    const clearCart = useCallback(() => {
        saveCart([]);
    }, [saveCart]);

    // Initialize cart totals
    React.useEffect(() => {
        let total = 0;
        let count = 0;
        cartItems.forEach(item => {
            if (item.productId?.price) {
                total += item.productId.price * item.quantity;
                count += item.quantity;
            }
        });
        setTotalAmount(total);
        setItemCount(count);
    }, [cartItems]);

    const value = {
        cartItems,
        totalAmount,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
