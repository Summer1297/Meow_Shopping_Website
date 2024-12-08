import { SERVER } from './constants';

function fetchRequest(url, method, body) {
  return fetch(url, {
    method,
    headers: new Headers({
      'content-type': 'application/json',
    }),
    credentials: 'include',
    body: JSON.stringify(body),
  })
  .catch(() => Promise.reject({ error: 'networkError' }))
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json()
      .catch(error => Promise.reject({ error }))
      .then(err => Promise.reject(err));
  });
}

export function fetchSession() {
  return fetchRequest('api/session', 'GET');
}

export function fetchLogin(username) {
  return fetchRequest('api/session', 'POST', { username })
    .catch(err => {
      if (err.error === 'auth-insufficient') {
        return Promise.reject({ error: SERVER.AUTH_INSUFFICIENT });
      }
      if (err.error === 'user-not-found') {
        return Promise.reject({ error: SERVER.USER_NOT_FOUND });
      }
      if (err.error === 'invalid-username') {
        return Promise.reject({ error: SERVER.INVALID_USERNAME });
      }
      return Promise.reject(err);
    });
}

export function fetchLogout() {
  return fetchRequest('api/session', 'DELETE');
}

export function fetchRegister(username) {
  return fetchRequest('api/users', 'POST', { username });
}

export function fetchCart() {
  return fetchRequest('api/cart', 'GET');
}

export function fetchAddToCart(productId, quantity) {
  return fetchRequest('api/cart', 'POST', { productId, quantity });
}

export function fetchRemoveFromCart(productId) {
  return fetchRequest(`api/cart/${productId}`, 'DELETE')
    .then(response => {
      if (response.error) {
        return Promise.reject(new Error(response.error));
      }
      return response;
    });
}

export function fetchProducts() {
  return fetchRequest('/api/products', 'GET');
}

export function fetchAddProduct(productData) {
  return fetchRequest('/api/products', 'POST', productData);
}

export function fetchUpdateProduct(id, productData) {
  return fetchRequest(`/api/products/${id}`, 'PUT', productData);
}

export function fetchDeleteProduct(id) {
  return fetchRequest(`/api/products/${id}`, 'DELETE');
}

export function fetchCheckout() {
  return fetchRequest('api/cart/checkout', 'POST');
}