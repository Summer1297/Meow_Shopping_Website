import { useState, useEffect } from 'react';
import { fetchProducts, fetchAddProduct, fetchUpdateProduct, fetchDeleteProduct } from '../services';
import ProductForm from './ProductForm';
import Modal from './Modal';
import './AdminPage.css';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    fetchProducts()
      .then(setProducts)
      .catch(err => setError('Failed to load products'));
  };

  const handleAddProduct = (productData) => {
    console.log('Adding product:', productData);
    fetchAddProduct(productData)
      .then(newProduct => {
        console.log('Product added successfully:', newProduct);
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setError('');
      })
      .catch(err => {
        console.error('Failed to add product:', err);
        setError(err.message || 'Failed to add product');
      });
  };

  const handleUpdateProduct = (productData) => {
    if (!editingProduct) return;
    
    fetchUpdateProduct(editingProduct.id, productData)
      .then(updatedProduct => {
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === editingProduct.id ? updatedProduct : product
          )
        );
        setEditingProduct(null); // Reset editing state
        setError('');
      })
      .catch(err => {
        console.error('Failed to update product:', err);
        setError('Failed to update product');
      });
  };

  const handleDeleteClick = (productId) => {
    setDeleteModal({
      isOpen: true,
      productId
    });
  };

  const handleDeleteConfirm = () => {
    const productId = deleteModal.productId;
    fetchDeleteProduct(productId)
      .then(() => {
        setProducts(prevProducts => 
          prevProducts.filter(product => product.id !== productId)
        );
        if (editingProduct?.id === productId) {
          setEditingProduct(null);
        }
        setError('');
      })
      .catch(err => {
        console.error('Failed to delete product:', err);
        setError('Failed to delete product');
      })
      .finally(() => {
        setDeleteModal({ isOpen: false, productId: null });
      });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setError('');
  };

  return (
    <div className="admin-page">
      <h1>Product Management</h1>
      {error && <div className="error-message">{error}</div>}
      
      <section className="product-form-section">
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <ProductForm 
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          initialData={editingProduct}
        />
        {editingProduct && (
          <button 
            onClick={handleCancelEdit}
            className="cancel-edit-btn"
          >
            Cancel Edit
          </button>
        )}
      </section>

      <section className="products-list">
        <h2>Product List</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>${Number(product.price).toFixed(2)}</p>
              </div>
              <div className="product-actions">
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(product.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default AdminPage;