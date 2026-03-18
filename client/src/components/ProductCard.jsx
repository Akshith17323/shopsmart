const ProductCard = ({ product, onAddToCart, index }) => {
  return (
    <div className="product-card" style={{ animationDelay: `${index * 100}ms` }}>
      <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="add-button" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
