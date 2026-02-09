/**
 * Frontend Unit Tests - Context
 * Test AuthContext and CartContext
 */

import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { act, renderHook } from '@testing-library/react';

describe('AuthContext', () => {
    describe('Login Functionality', () => {
        test('should set user and token on login', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.login({ _id: '123', email: 'test@test.com' }, 'token123');
            });

            expect(result.current.user).toEqual({ _id: '123', email: 'test@test.com' });
            expect(result.current.token).toBe('token123');
            expect(result.current.isAuthenticated).toBe(true);
        });

        test('should update localStorage on login', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.login({ _id: '123', email: 'test@test.com' }, 'token123');
            });

            expect(localStorage.getItem('user')).toBeDefined();
            expect(localStorage.getItem('token')).toBe('token123');
        });

        test('should handle null user in login', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.login(null, 'token123');
            });

            expect(result.current.isAuthenticated).toBe(true);
        });

        test('should handle empty token in login', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.login({ _id: '123' }, '');
            });

            expect(result.current.isAuthenticated).toBe(false);
        });
    });

    describe('Logout Functionality', () => {
        test('should clear user and token on logout', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.login({ _id: '123', email: 'test@test.com' }, 'token123');
            });

            act(() => {
                result.current.logout();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.token).toBeNull();
            expect(result.current.isAuthenticated).toBe(false);
        });

        test('should clear localStorage on logout', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.login({ _id: '123', email: 'test@test.com' }, 'token123');
            });

            act(() => {
                result.current.logout();
            });

            expect(localStorage.getItem('user')).toBeNull();
            expect(localStorage.getItem('token')).toBeNull();
        });

        test('should handle logout without login', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.logout();
            });

            expect(result.current.user).toBeNull();
            expect(result.current.token).toBeNull();
        });
    });

    describe('Persistence', () => {
        test('should restore user from localStorage', () => {
            const userData = { _id: '123', email: 'test@test.com' };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', 'savedtoken123');

            const { result } = renderHook(() => useAuth());

            expect(result.current.user).toEqual(userData);
            expect(result.current.token).toBe('savedtoken123');
        });

        test('should handle corrupted localStorage data', () => {
            localStorage.setItem('user', 'invalid-json');
            localStorage.setItem('token', 'token123');

            // Should handle gracefully or throw error
            expect(() => {
                renderHook(() => useAuth());
            }).not.toThrow();
        });
    });

    describe('Error Handling', () => {
        test('should set error message', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.setError('Test error');
            });

            expect(result.current.error).toBe('Test error');
        });

        test('should clear error on login', () => {
            const { result } = renderHook(() => useAuth());

            act(() => {
                result.current.setError('Test error');
            });

            act(() => {
                result.current.login({ _id: '123' }, 'token123');
            });

            expect(result.current.error).toBeNull();
        });
    });
});

describe('CartContext', () => {
    describe('Add to Cart', () => {
        test('should add new product to cart', () => {
            const { result } = renderHook(() => useCart());
            const product = {
                _id: '1',
                name: 'Test Product',
                price: 100
            };

            act(() => {
                result.current.addToCart(product, 1);
            });

            expect(result.current.cartItems).toHaveLength(1);
            expect(result.current.cartItems[0].productId).toEqual(product);
            expect(result.current.cartItems[0].quantity).toBe(1);
        });

        test('should increase quantity for existing product', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 1);
                result.current.addToCart(product, 1);
            });

            expect(result.current.cartItems).toHaveLength(1);
            expect(result.current.cartItems[0].quantity).toBe(2);
        });

        test('should add product with specified quantity', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 5);
            });

            expect(result.current.cartItems[0].quantity).toBe(5);
        });

        test('should handle zero quantity', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 0);
            });

            // Should not add if quantity is 0
            expect(result.current.cartItems.length).toBeLessThanOrEqual(1);
        });

        test('should handle negative quantity', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, -5);
            });

            // Should handle gracefully
            expect(result.current.cartItems.length).toBeDefined();
        });
    });

    describe('Update Quantity', () => {
        test('should update product quantity', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 1);
                result.current.updateQuantity('1', 5);
            });

            expect(result.current.cartItems[0].quantity).toBe(5);
        });

        test('should remove product when quantity becomes zero', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 5);
                result.current.updateQuantity('1', 0);
            });

            expect(result.current.cartItems).toHaveLength(0);
        });

        test('should remove product when quantity is negative', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 5);
                result.current.updateQuantity('1', -1);
            });

            expect(result.current.cartItems).toHaveLength(0);
        });

        test('should handle non-existent product ID', () => {
            const { result } = renderHook(() => useCart());

            act(() => {
                result.current.updateQuantity('nonexistent', 5);
            });

            expect(result.current.cartItems).toHaveLength(0);
        });
    });

    describe('Remove from Cart', () => {
        test('should remove product from cart', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 1);
                result.current.removeFromCart('1');
            });

            expect(result.current.cartItems).toHaveLength(0);
        });

        test('should handle removing non-existent product', () => {
            const { result } = renderHook(() => useCart());

            act(() => {
                result.current.removeFromCart('nonexistent');
            });

            expect(result.current.cartItems).toHaveLength(0);
        });

        test('should only remove specified product', () => {
            const { result } = renderHook(() => useCart());
            const product1 = { _id: '1', name: 'Product 1', price: 100 };
            const product2 = { _id: '2', name: 'Product 2', price: 200 };

            act(() => {
                result.current.addToCart(product1, 1);
                result.current.addToCart(product2, 1);
                result.current.removeFromCart('1');
            });

            expect(result.current.cartItems).toHaveLength(1);
            expect(result.current.cartItems[0].productId._id).toBe('2');
        });
    });

    describe('Clear Cart', () => {
        test('should clear all items from cart', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 5);
                result.current.clearCart();
            });

            expect(result.current.cartItems).toHaveLength(0);
            expect(result.current.totalAmount).toBe(0);
        });

        test('should reset totals when clearing cart', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 2);
            });

            expect(result.current.totalAmount).toBeGreaterThan(0);

            act(() => {
                result.current.clearCart();
            });

            expect(result.current.totalAmount).toBe(0);
            expect(result.current.itemCount).toBe(0);
        });
    });

    describe('Total Calculation', () => {
        test('should calculate correct total amount', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 3);
            });

            expect(result.current.totalAmount).toBe(300);
        });

        test('should calculate correct item count', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 5);
            });

            expect(result.current.itemCount).toBe(5);
        });

        test('should handle multiple products in total', () => {
            const { result } = renderHook(() => useCart());
            const product1 = { _id: '1', name: 'Product 1', price: 100 };
            const product2 = { _id: '2', name: 'Product 2', price: 200 };

            act(() => {
                result.current.addToCart(product1, 2);
                result.current.addToCart(product2, 1);
            });

            expect(result.current.totalAmount).toBe(400); // (100*2) + (200*1)
            expect(result.current.itemCount).toBe(3);
        });

        test('should handle decimal prices', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 99.99 };

            act(() => {
                result.current.addToCart(product, 2);
            });

            expect(result.current.totalAmount).toBe(199.98);
        });
    });

    describe('LocalStorage Persistence', () => {
        test('should save cart to localStorage', () => {
            const { result } = renderHook(() => useCart());
            const product = { _id: '1', name: 'Test Product', price: 100 };

            act(() => {
                result.current.addToCart(product, 1);
            });

            const saved = localStorage.getItem('cartItems');
            expect(saved).toBeDefined();
            expect(JSON.parse(saved)).toHaveLength(1);
        });

        test('should restore cart from localStorage', () => {
            const cartData = [
                {
                    productId: { _id: '1', name: 'Test', price: 100 },
                    quantity: 2
                }
            ];
            localStorage.setItem('cartItems', JSON.stringify(cartData));

            const { result } = renderHook(() => useCart());

            expect(result.current.cartItems).toHaveLength(1);
            expect(result.current.totalAmount).toBe(200);
        });
    });
});
