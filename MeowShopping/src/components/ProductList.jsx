import { useState, useEffect } from 'react';
import { fetchProducts } from '../services';
import ProductItem from './ProductItem';
import './ProductList.css';

const ProductList = ({ onCartUpdate, isLoggedIn, onLoginRequired }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetchProducts()
      .then(data => {
        setProducts(data);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      });
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!products.length) {
    return <div className="no-products">No products available</div>;
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="product-list-container">
      <div className="product-list">
        {currentProducts.map(product => (
          <ProductItem 
            key={product.id} 
            product={product}
            onCartUpdate={onCartUpdate}
            isLoggedIn={isLoggedIn}
            onLoginRequired={onLoginRequired}
          />
        ))}
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Prev
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;