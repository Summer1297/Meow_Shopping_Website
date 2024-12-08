import { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState('');

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        image: initialData.image || ''
      });
      setImagePreview(initialData.image || '');
    } else {
      setFormData({
        name: '',
        price: '',
        image: ''
      });
      setImagePreview('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      return;
    }
    
    onSubmit({
      name: formData.name.trim(),
      price: Number(formData.price),
      image: formData.image.trim() || null
    });

    // Only clear form if not editing
    if (!initialData) {
      setFormData({
        name: '',
        price: '',
        image: ''
      });
      setImagePreview('');
    }
  };

  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setFormData({...formData, image: imageUrl});
    setImagePreview(imageUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label>
          Product Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            placeholder="Enter product name"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Price:
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
            min="0"
            step="0.01"
            placeholder="Enter price"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Image URL: (optional)
          <input
            value={formData.image}
            onChange={handleImageChange}
            placeholder="Enter image URL (optional)"
          />
        </label>
      </div>

      {imagePreview && (
        <div className="image-preview">
          <img 
            src={imagePreview} 
            alt="Product preview"
            onError={(e) => {
              e.target.style.display = 'none';
              setImagePreview('');
            }}
            onLoad={(e) => {
              e.target.style.display = 'block';
            }}
          />
        </div>
      )}

      <button type="submit" className="submit-btn">
        {initialData ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm; 