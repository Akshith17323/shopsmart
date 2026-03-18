import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Point to backend standard port for local dev
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/products`);
                if (!response.ok) {
                   throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        const cartItem = { ...product, cartId: crypto.randomUUID() };
        setCartItems(prev => [...prev, cartItem]);
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    return (
        <div className="app-container">
            <header>
                <h1 className="logo">ShopSmart</h1>
                <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                    <span>Cart</span>
                    {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                </button>
            </header>

            <main>
                {loading ? (
                    <div className="status-loading">Loading amazing products...</div>
                ) : (
                    <div className="products-grid">
                        {products.map((product, index) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                index={index}
                                onAddToCart={handleAddToCart} 
                            />
                        ))}
                    </div>
                )}
            </main>

            <Cart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cartItems}
                onRemoveFromCart={handleRemoveFromCart}
            />
        </div>
    );
}

export default App;
