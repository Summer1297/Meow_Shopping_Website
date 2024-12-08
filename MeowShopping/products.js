import { randomUUID as uuid } from 'crypto';

const products = {
  '1': {
    id: '1',
    name: 'iWatch 10',
    price: 999.99,
    image: '/images/iWatch.jpg'
  },
  '2': {
    id: '2',
    name: 'MacBook Pro 16"',
    price: 2499.99,
    image: '/images/macbookPro.jpg'
  },
  '3': {
    id: '3',
    name: 'AirPods Pro',
    price: 249.99,
    image: '/images/airpodsPro.jpg'
  },
  '4': {
    id: '4',
    name: 'iPad Air 12.9',
    price: 1099.99,
    image: '/images/ipadAir.jpg'
  },
  '5': {
    id: '5',
    name: 'Air Tag',
    price: 99.99,
    image: '/images/airTag.jpg'
  },
  '6': {
    id: '6',
    name: 'iPhone 16 Pro',
    price: 999.99,
    image: '/images/iphone16p.jpg'
  },
  '7': {
    id: '7',
    name: 'iPhone 16 Pro Max',
    price: 1299.99,
    image: '/images/iphone16pm.jpg'
  },
  '8': {
    id: '8',
    name: 'Airpods',
    price: 129.99,
    image: '/images/Airpods.jpg'
  }
};

const DEFAULT_IMAGE = '/images/defaultImage.jpg';

function addProduct(name, price, image = DEFAULT_IMAGE) {
  const id = uuid();
  const newProduct = { 
    id, 
    name, 
    price: Number(price),
    image: image || DEFAULT_IMAGE
  };
  products[id] = newProduct;
  return newProduct;
}

function getProduct(id) {
  return products[id];
}

function getAllProducts() {
  return Object.values(products);
}

function updateProduct(id, updates) {
  if (products[id]) {
    products[id] = { 
      ...products[id], 
      ...updates,
      price: Number(updates.price),
      image: updates.image || DEFAULT_IMAGE
    };
    return products[id];
  }
  return null;
}

function deleteProduct(id) {
  if (products[id]) {
    delete products[id];
    return true;
  }
  return false;
}

export default { 
    addProduct, 
    getProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct 
};