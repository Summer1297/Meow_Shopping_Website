import './Header.css';

const Header = ({ 
  username, 
  isAdmin, 
  cartItemCount, 
  showCart, 
  onCartClick, 
  onLogout,
  isLoggedIn 
}) => {
  return (
    <header className="header">
      <div className="header__content">
        <h1>{isAdmin ? 'Admin Dashboard' : 'Meow Meow Apple Store'}</h1>
        <div className="header__bottom">
          <div className="header__welcome">
            <p>{username ? `Welcome, ${username}` : ''}</p>
          </div>
          <div className="controls">
            {!isAdmin && (
              <button 
                className={`cart-button ${cartItemCount === 0 ? 'empty' : ''}`}
                onClick={onCartClick}
              >
                {showCart ? 'View Products' : 'Cart'}
                {isLoggedIn && !showCart && cartItemCount > 0 && (
                  <span className="cart-counter">{`(${cartItemCount})`}</span>
                )}
              </button>
            )}
            <button className="logout-button" onClick={onLogout}>
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;