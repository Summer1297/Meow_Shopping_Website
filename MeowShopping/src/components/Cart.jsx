import { useState, useEffect } from 'react';
import { fetchCart, fetchAddToCart, fetchCheckout, fetchRemoveFromCart } from '../services';
import './Cart.css';

const Cart = ({ onCartUpdate, onCheckout }) => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState({});
  const [error, setError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchCart(),
      fetch('/api/products').then(res => res.json())
    ])
      .then(([cartData, productsData]) => {
        setCart(cartData);
        const productsMap = {};
        productsData.forEach(product => {
          productsMap[product.id] = product;
        });
        setProducts(productsMap);
      })
      .catch(err => {
        console.error('Failed to fetch cart or products:', err);
        setError('Failed to load cart');
      });
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) return;

    const currentQuantity = cart[productId] || 0;
    const quantityDiff = newQuantity - currentQuantity;

    fetchAddToCart(productId, quantityDiff)
      .then(updatedCart => {
        setCart(updatedCart);
        if (onCartUpdate) {
          onCartUpdate(updatedCart);
        }
      })
      .catch(err => {
        console.error('Failed to update quantity:', err);
        setError('Failed to update quantity');
      });
  };

  const handleRemove = (productId) => {
    fetchRemoveFromCart(productId)
      .then(updatedCart => {
        setCart(updatedCart || {});
        if (onCartUpdate) {
          onCartUpdate(updatedCart || {});
        }
      })
      .catch(err => {
        console.error('Failed to remove item:', err);
        setError('Failed to remove item');
      });
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    fetchCheckout()
      .then(() => {
        setCart({});
        if (onCartUpdate) {
          onCartUpdate({});
        }
        if (onCheckout) {
          onCheckout();
        }
      })
      .catch(err => {
        console.error('Checkout failed:', err);
        setError('Checkout failed');
      })
      .finally(() => {
        setIsCheckingOut(false);
      });
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const total = Object.entries(cart).reduce((sum, [productId, quantity]) => {
    const product = products[productId];
    return sum + (product?.price || 0) * quantity;
  }, 0);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {Object.entries(cart).map(([productId, quantity]) => {
          const product = products[productId];
          if (!product) return null;
          
          return (
            <div key={productId} className="cart-item">
              <div className="cart-item__image">
                <img 
                  src={product.image || '/placeholder-image.jpg'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <div className="cart-item__info">
                <span className="product-name">{product.name}</span>
                <span className="product-price">${product.price}</span>
              </div>
              <div className="cart-item__controls">
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(productId, quantity - 1)}
                  disabled={quantity < 0}
                >
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(productId, quantity + 1)}
                >
                  +
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemove(productId)}
                >
                  Remove
                </button>
                <span className="item-total">
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {Object.keys(cart).length > 0 ? (
        <div className="cart-summary">
          <div className="cart-total">
            Total: ${total.toFixed(2)}
          </div>
          <button 
            className={`checkout-btn ${isCheckingOut ? 'loading' : ''}`}
            onClick={handleCheckout}
            disabled={isCheckingOut || total === 0}
          >
            {isCheckingOut ? 'Processing...' : 'Checkout'}
          </button>
        </div>
      ) : (
        <div className="empty-cart">
          Your cart is empty
        </div>
      )}
    </div>
  );
};

export default Cart;