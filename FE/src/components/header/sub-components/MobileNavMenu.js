import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
// import { multilanguage } from "redux-multilanguage";

const MobileNavMenu = ({ strings }) => {
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={process.env.PUBLIC_URL + "/"}>home</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/shop"}>collection</Link>
        </li>

        <li>
          <Link to={process.env.PUBLIC_URL + "/about"}>about us</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/blog"}>blog</Link>
        </li>
        {/* <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>contact us</Link>
        </li> */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>Other</Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/cart"}>cart</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/checkout"}>checkout</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/wishlist"}>wishlist</Link>
            </li>

            <li>
              <Link to={process.env.PUBLIC_URL + "/my-account"}>
                My account
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/login-register"}>
                login/register
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

MobileNavMenu.propTypes = {
  strings: PropTypes.object,
};

export default MobileNavMenu;
