const carts = {};

function addToCart(username, productId, quantity) {
  if (!carts[username]) {
    carts[username] = {};
  }
  carts[username][productId] = (carts[username][productId] || 0) + quantity;
  return carts[username];
}

function removeFromCart(username, productId) {
  if (!carts[username]) {
    carts[username] = {};
  }
  delete carts[username][productId];
  return carts[username];
}

function updateCart(username, productId, quantity) {
  if (!carts[username]) {
    carts[username] = {};
  }
  carts[username][productId] = quantity;
  return carts[username];
}

function getCart(username) {
  return carts[username] || {};
}

function clearCart(username) {
  delete carts[username];
}

export default {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
  updateCart
};