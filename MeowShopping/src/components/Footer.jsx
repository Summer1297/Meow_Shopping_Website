import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__section">
          <h3>About Us</h3>
          <p>Providing quality shopping experience</p>
        </div>
        <div className="footer__section">
          <h3>Contact</h3>
          <p>Email: contact@example.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        <div className="footer__section">
          <h3>Follow Us</h3>
          <ul>
            <li><a href="#twitter">Twitter</a></li>
            <li><a href="#instagram">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2024 Tech Store. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;