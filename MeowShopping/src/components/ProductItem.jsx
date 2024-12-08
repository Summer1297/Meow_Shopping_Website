import { useState } from 'react';
import { fetchAddToCart } from '../services';
import './ProductItem.css';

const ProductItem = ({ product, onCartUpdate, isLoggedIn, onLoginRequired }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    setIsAdding(true);
    fetchAddToCart(product.id, 1)
      .then(updatedCart => {
        if (onCartUpdate) {
          onCartUpdate(updatedCart);
        }
        
        setTimeout(() => {
          setIsAdding(false);
        }, 1000);
      })
      .catch(err => {
        console.error('Failed to add to cart:', err);
        setIsAdding(false);
      });
  };

  return (
    <div className="product-item">
      <img 
        src={product.image || '/placeholder-image.jpg'}
        alt={product.name}
        onError={(e) => {
          e.target.src = '/placeholder-image.jpg';
        }}
        className="product-image"
      />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <button 
        className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        {isAdding ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductItem;