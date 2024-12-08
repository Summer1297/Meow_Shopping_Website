import express from 'express';
import cookieParser from 'cookie-parser';

import sessions from './sessions.js';
import users from './users.js';
import carts from './carts.js';
import products from './products.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());


function authUser(req, res, next) {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !users.isValid(username)) {
      return res.status(401).json({ error: 'auth-missing' });
    }
    if(username === 'dog') {
      res.status(403).json({ error: 'auth-insufficient' });
      return;
    }
    req.username = username;
    req.userRole = users.getUserData(username).role;
    next();
}
// Check if the user is admin
function authAdmin(req, res, next) {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'admin-only' });
    }
    next();
}


//Sessions
app.get('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const userData = users.getUserData(username);
    res.json({ 
        username,
        role: userData?.role || 'user'
    });
});

app.post('/api/session', (req, res) => {
    const { username } = req.body;

    if (!username) {
        res.status(400).json({ error: 'required-username' });
        return;
    }
    if (!users.isValid(username)) {
        res.status(400).json({ error: 'invalid-username' });
        return;
    }
    if(username === 'dog') {
      res.status(403).json({ error: 'dog-forbidden' });
      return;
    }

    const userData = users.getUserData(username);
    if (!userData) {
        res.status(401).json({ error: 'user-not-found' });
        return;
    }
    const sid = sessions.addSession(username);
    res.cookie('sid', sid);
    res.json({ 
        username,
        role: userData.role
    });
});
app.delete('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (sid) {
        res.clearCookie('sid');
    }
    if (username) {
        sessions.deleteSession(sid);
    }
    res.json({ username });
});

//Carts
app.get('/api/cart', authUser, (req, res) => {
    const cart = carts.getCart(req.username);
    res.status(200).json(cart);
});

app.post('/api/cart', authUser, (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'missing-fields' });
    }
    carts.addToCart(req.username, productId, quantity);
    res.status(201).json(carts.getCart(req.username));
});

app.delete('/api/cart/:pid', authUser, (req, res) => {
    const username = req.username;
    const productId = req.params.pid;
    const updatedCart = carts.removeFromCart(username, productId);
    res.status(200).json(updatedCart);
});

app.post('/api/cart/checkout', authUser, (req, res) => {
    const username = req.username;
    carts.clearCart(username);
    res.status(201).json({ message: 'Checkout successful' });
});

app.patch('/api/cart/:pid', authUser, (req, res) => {
    const username = req.username;
    const productId = req.params.pid;
    const quantity = Number(req.body.quantity);
    
    const updatedCart = carts.updateCart(username, productId, quantity);
    res.status(200).json(updatedCart);
});



// No need to check auth, cause all users can see the products
app.get('/api/products', (req, res) => {
    const allProducts = products.getAllProducts();
    res.json(allProducts);
});

// Only admin can add products
app.post('/api/products', authUser, authAdmin, (req, res) => {
    const { name, price, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'missing-required-fields' });
    }
    
    const newProduct = products.addProduct(name, price, image);
    res.status(201).json(newProduct);
});

// Only admin can update products
app.put('/api/products/:id', authUser, authAdmin, (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'missing-fields' });
    }

    const updatedProduct = products.updateProduct(req.params.id, { name, price });
    if (!updatedProduct) {
      res.status(404).json({ error: 'product-not-found' });
      return;
    }
    res.json(updatedProduct);
});
// Only admin can delete products
app.delete('/api/products/:id', authUser, authAdmin, (req, res) => {
    const { id } = req.params;
    const result = products.deleteProduct(id);
    if (result) {
      res.json({ success: true, message: 'product is deleted successly', id });
    } else {
      res.status(404).json({ success: false, message: 'error: product not exist', id });
    }
  });

//Registration
// No need to check auth, cause all users can register
app.post('/api/users', (req, res) => {
    const { username } = req.body;
    if (!username || !username.trim()) {
        res.status(400).json({ error: 'required-username' });
        return;
    }
    if (!users.isValid(username)) {
        res.status(400).json({ error: 'invalid-username' });
        return;
    }
    if (users.getUserData(username)) {
        res.status(409).json({ error: 'username-exists' });
        return;
    }
    users.addUserData(username, {});
    res.json({ 
        message: 'Registration successful. Please login.',
        username 
    });
});



app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
