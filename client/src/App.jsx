import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import ContactForm from './components/ContactForm';

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <nav className="navbar">
                <div className="nav-brand">
                    <h1 className="logo">ShopSmart</h1>
                </div>
                <ul className="nav-links">
                    <li><a href="#products">Products</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div className="header-controls">
                    {isLoggedIn ? (
                        <button className="logout-button" onClick={() => setIsLoggedIn(false)}>Logout</button>
                    ) : (
                        <button className="login-button" onClick={() => setIsLoggedIn(true)}>Login</button>
                    )}
                    <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                        <span>Cart</span>
                        {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                    </button>
                </div>
            </nav>

            <main>
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>Elevate Your Every Day</h1>
                        <p>Discover a curated collection of premium gear designed for the modern professional. Uncompromising quality meets timeless minimalist design.</p>
                        <a href="#products" className="hero-cta">Explore the Collection</a>
                    </div>
                </section>

                <section id="products" className="products-section">
                    <h2 className="section-title">Featured Gear</h2>
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
                </section>

                <section id="contact" className="contact-section">
                    <ContactForm />
                </section>
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h2 className="logo">ShopSmart</h2>
                        <p>Providing premium gear for modern professionals.</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 ShopSmart. All rights reserved.</p>
                </div>
            </footer>

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
