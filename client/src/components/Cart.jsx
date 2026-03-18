const Cart = ({ isOpen, onClose, cartItems, onRemoveFromCart }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Your Cart ({cartItems.length})</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty-state">Your cart is empty.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.cartId} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <div className="cart-item-title">{item.name}</div>
                <div className="cart-item-price">${item.price.toFixed(2)}</div>
              </div>
              <button 
                className="cart-item-remove" 
                onClick={() => onRemoveFromCart(item.cartId)}
                aria-label="Remove item"
              >
                &#10005;
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button 
          className="checkout-button"
          onClick={() => alert('Checkout not implemented for this demo!')}
          disabled={cartItems.length === 0}
          style={{ opacity: cartItems.length === 0 ? 0.5 : 1 }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
