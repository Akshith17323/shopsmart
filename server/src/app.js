const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString()
  });
});

const products = [
  { id: 1, name: 'Premium Wireless Headphones', description: 'High-quality noise-canceling headphones for immersive audio.', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { id: 2, name: 'Minimalist Smartwatch', description: 'Track your fitness and notifications with this sleek smartwatch.', price: 199.50, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { id: 3, name: 'Ergonomic Desk Chair', description: 'Comfortable mesh chair designed for long hours of productivity.', price: 149.00, image: 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=500' },
  { id: 4, name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with tactile switches.', price: 129.99, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80' },
  { id: 5, name: '4K Ultra HD Monitor', description: 'Stunning 27-inch 4K monitor for gaming and professional work.', price: 349.99, image: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?w=500&q=80' },
  { id: 6, name: 'Portable SSD 1TB', description: 'Fast and reliable external storage for all your files.', price: 109.99, image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=500' }
];

// Product Route
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Root Route (optional, just to show something)
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
