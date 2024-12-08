import { useEffect, useReducer } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { fetchProducts, fetchCart, fetchLogin, fetchSession, fetchLogout, fetchRegister } from './services';
import Spinner from './components/Spinner';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import AdminPage from './components/AdminPage';
import Footer from './components/Footer';
import Header from './components/Header';
import './App.css';
import { ACTIONS, MESSAGES, CLIENT } from './constants';


const initialState = {
  user: null,
  cart: {},
  isLoading: true,
  error: null,
  success: null,
  showAuth: false,
  isRegistering: false,
  isAdmin: false,
  showCart: false,
  loginModal: { isOpen: false }
};


function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_USER:
      return { ...state, user: action.payload };
    case ACTIONS.SET_CART:
      return { ...state, cart: action.payload };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_SUCCESS:
      return { ...state, success: action.payload };
    case ACTIONS.SET_SHOW_AUTH:
      return { ...state, showAuth: action.payload };
    case ACTIONS.SET_IS_REGISTERING:
      return { ...state, isRegistering: action.payload };
    case ACTIONS.SET_IS_ADMIN:
      return { ...state, isAdmin: action.payload };
    case ACTIONS.SET_SHOW_CART:
      return { ...state, showCart: action.payload };
    case ACTIONS.SET_LOGIN_MODAL:
      return { ...state, loginModal: action.payload };
    default:
      return state;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    fetchSession()
      .then(data => {
        if (data.username) {
          dispatch({ type: ACTIONS.SET_USER, payload: { username: data.username } });
          dispatch({ type: ACTIONS.SET_IS_ADMIN, payload: data.role === 'admin' });
          return Promise.all([
            fetchProducts(),
            fetchCart()
          ]);
        }
      })
      .then(results => {
        if (results) {
          const [products, cart] = results;
          dispatch({ type: ACTIONS.SET_CART, payload: cart });
          dispatch({ type: ACTIONS.SET_USER, payload: { username: products[0].username } });
        }
      })
      .catch(err => {
        if (err.error !== 'auth-missing') {
          dispatch({ type: ACTIONS.SET_ERROR, payload: err.error || 'An error occurred' });
        }
      })
      .finally(() => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      });
  }, []);


  const handleLogin = (username) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    dispatch({ type: ACTIONS.SET_SUCCESS, payload: null });
    
    return fetchLogin(username)
      .then(data => {
        dispatch({ type: ACTIONS.SET_USER, payload: { username: data.username } });
        dispatch({ type: ACTIONS.SET_IS_ADMIN, payload: data.role === 'admin' });
        dispatch({ type: ACTIONS.SET_SHOW_AUTH, payload: false });
        return Promise.all([fetchProducts(), fetchCart()]);
      })
      .then(([products, cart]) => {
        if (cart) dispatch({ type: ACTIONS.SET_CART, payload: cart });
      })
      .catch(err => {
        console.error('Login failed:', err);
        const errorMessage = MESSAGES[err.error] || MESSAGES.default;
        dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
        throw err;
      })
      .finally(() => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      });
  };

  const handleRegister = (username) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    fetchRegister(username)
      .then(data => {
        dispatch({ type: ACTIONS.SET_IS_REGISTERING, payload: false });
        dispatch({ type: ACTIONS.SET_SUCCESS, payload: 'Registration successful. Please login.' });
      })
      .catch(err => {
        console.error('Registration failed:', err);
        const errorMessage = MESSAGES[err.error] || MESSAGES.default;
        dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      })
      .finally(() => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      });
  };

  const handleLogout = () => {
    fetchLogout()
      .then(() => {
        dispatch({ type: ACTIONS.SET_USER, payload: null });
        dispatch({ type: ACTIONS.SET_CART, payload: {} });
        dispatch({ type: ACTIONS.SET_IS_ADMIN, payload: false });
        dispatch({ type: ACTIONS.SET_SHOW_CART, payload: false });
      })
      .catch(err => {
        console.error('Logout failed:', err);
        const errorMessage = MESSAGES[err.error] || MESSAGES.default;
        dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      });
  };

  const handleCartUpdate = (updatedCart) => {
    if (!updatedCart) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: MESSAGES[CLIENT.UNKNOWN_ERROR] });
      return;
    }
    dispatch({ type: ACTIONS.SET_CART, payload: updatedCart });
  };

  const handleCheckout = () => {
    dispatch({ type: ACTIONS.SET_SHOW_CART, payload: false });
  };

  const handleShowAuth = () => {
    dispatch({ type: ACTIONS.SET_SHOW_AUTH, payload: true });
    dispatch({ type: ACTIONS.SET_SUCCESS, payload: null });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  };

  const handleLoginRequired = () => {
    handleShowAuth();
    dispatch({ type: ACTIONS.SET_IS_REGISTERING, payload: false });
  };

  const cartItemCount = Object.values(state.cart).reduce((total, quantity) => total + quantity, 0);
  if (state.isLoading) {
    return <Spinner />;
  }

  return (
    <div className="App">
      {state.showAuth ? (
        <div className="auth-container">
          {state.error && <div className="error-message">{state.error}</div>}
          {state.success && <div className="success-message">{state.success}</div>}
          {state.isRegistering ? (
            <RegisterForm 
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                dispatch({ type: ACTIONS.SET_IS_REGISTERING, payload: false });
                dispatch({ type: ACTIONS.SET_ERROR, payload: null });
                dispatch({ type: ACTIONS.SET_SUCCESS, payload: null });
              }}
            />
          ) : (
            <LoginForm 
              onLogin={handleLogin}
              onSwitchToRegister={() => {
                dispatch({ type: ACTIONS.SET_IS_REGISTERING, payload: true });
                dispatch({ type: ACTIONS.SET_ERROR, payload: null });
                dispatch({ type: ACTIONS.SET_SUCCESS, payload: null });
              }}
            />
          )}
        </div>
      ) : state.user ? (
        // already logged in
        <>
          <Header 
            username={state.user.username}
            isAdmin={state.isAdmin}
            cartItemCount={cartItemCount}
            showCart={state.showCart}
            onCartClick={() => {
              if (!state.user) {
                handleLoginRequired();
              } else {
                dispatch({ type: ACTIONS.SET_SHOW_CART, payload: !state.showCart });
              }
            }}
            onLogout={handleLogout}
            isLoggedIn={true}
          />
          <main>
            {state.error && <div className="error-message">{state.error}</div>}
            {state.isAdmin ? (
              <AdminPage />
            ) : (
              state.showCart ? (
                <Cart 
                  onCartUpdate={handleCartUpdate} 
                  onCheckout={handleCheckout}
                />
              ) : (
                <>
                  <h2>Products</h2>
                  <ProductList 
                    onCartUpdate={handleCartUpdate}
                    isLoggedIn={true}
                    onLoginRequired={handleLoginRequired}
                  />
                </>
              )
            )}
          </main>
          <Footer />
        </>
      ) : (
        // no logged in user interface
        <>
          <Header 
            isAdmin={false}
            cartItemCount={0}
            showCart={false}
            onCartClick={() => {
              dispatch({ type: ACTIONS.SET_SHOW_AUTH, payload: true });
              dispatch({ type: ACTIONS.SET_IS_REGISTERING, payload: false });
            }}
            onLogout={() => {
              dispatch({ type: ACTIONS.SET_SHOW_AUTH, payload: true });
              dispatch({ type: ACTIONS.SET_IS_REGISTERING, payload: false });
            }}
            isLoggedIn={false}
          />
          <main>
            {state.error && <div className="error-message">{state.error}</div>}
            <h2>Products</h2>
            <ProductList 
              onCartUpdate={handleLoginRequired}
              isLoggedIn={false}
              onLoginRequired={handleLoginRequired}
            />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;