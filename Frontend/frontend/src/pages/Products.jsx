import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();

    const query = searchParams.get('query');
    const category = searchParams.get('category');

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            if (query) {
                response = await productAPI.searchProducts(query, limit, offset);
            } else {
                response = await productAPI.getAllProducts(limit, offset);
            }

            const newProducts = response.data.data || [];
            
            if (offset === 0) {
                setProducts(newProducts);
            } else {
                setProducts(prev => [...prev, ...newProducts]);
            }

            setHasMore(newProducts.length === limit);
        } catch (err) {
            setError(err.response?.data?.message || 'Error loading products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setProducts([]);
        setOffset(0);
        setHasMore(true);
    }, [query, category]);

    useEffect(() => {
        fetchProducts();
    }, [query, category, limit, offset]);

    const handleLoadMore = () => {
        setOffset(prev => prev + limit);
    };

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        alert(`${product.name} added to cart!`);
    };

    if (error && offset === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">
                    {query ? `Search Results for "${query}"` : 'All Products'}
                </h1>
                <div className="flex gap-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg">
                        <option>Sort by: Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest</option>
                        <option>Best Sellers</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition">
                                {/* Product Image */}
                                <Link to={`/product/${product._id}`} className="block overflow-hidden bg-gray-200 h-64">
                                    <img
                                        src={product.imageUrl || '📷'}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-110 transition transform"
                                    />
                                </Link>

                                {/* Product Info */}
                                <div className="p-4">
                                    <Link to={`/product/${product._id}`} className="block">
                                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-pink-600">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Price */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-lg font-bold">₹{product.price}</span>
                                        <span className="text-xs text-gray-500">
                                            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                                        </span>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.quantity === 0}
                                        className={`w-full py-2 rounded font-medium text-sm transition ${
                                            product.quantity > 0
                                                ? 'bg-pink-600 text-white hover:bg-pink-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-8 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:bg-gray-400"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No products found</p>
                    </div>
                )
            )}

            {/* Loading */}
            {loading && offset === 0 && (
                <div className="flex justify-center py-12">
                    <div className="text-gray-600">Loading products...</div>
                </div>
            )}
        </div>
    );
}
