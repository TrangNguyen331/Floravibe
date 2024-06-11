import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import MenuCart from "./sub-components/MenuCart";
import { deleteFromCart } from "../../redux/actions/cartActions";
import { logOutUser } from "../../redux/actions/authAction";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import Dropdown from "react-bootstrap/Dropdown";
import { useTranslation } from "react-i18next";
import { locales } from "../../i18n";

const IconGroup = ({
  currency,
  cartData,
  wishlistData,
  compareData,
  deleteFromCart,
  iconWhiteClass,
}) => {
  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode);
  };
  const { t, i18n } = useTranslation(["header"]);
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  const currenLanguage = locales[i18n.language];

  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const history = useHistory();
  const isLogin = useSelector((state) => state.auth.token);
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logOutUser(addToast));
    history.push(process.env.PUBLIC_URL + "/");
  };
  const [userAvatar, setUserAvatar] = useState({
    avatar: "",
    username: "",
  });
  useEffect(() => {
    const setDataInit = async () => {
      if (isLogin) {
        const response = await axiosInstance.get("/api/v1/auth/identity");
        setUserAvatar({
          avatar: response.data.avatar || "",
          username: response.data.username || "",
        });
      }
    };
    setDataInit();
  }, []);
  return (
    <div
      className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}
    >
      {/* Search */}
      {/* <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={(e) => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div> */}

      <div>
        <Dropdown
          className="same-style translate-wrap"
          onChange={(e) => changeLanguage(e.target.value)}
          onSelect={handleLanguageChange}
        >
          <Dropdown.Toggle className="toggle" id="dropdown-basic">
            {currenLanguage}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="en" onClick={() => changeLanguage("en")}>
              English
            </Dropdown.Item>
            <Dropdown.Item eventKey="vi" onClick={() => changeLanguage("vi")}>
              Tiếng Việt
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareData && compareData.length ? compareData.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistData && wishlistData.length ? wishlistData.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button
          className="icon-cart"
          onClick={(e) => {
            if (cartData.length === 0) {
              window.location.href = process.env.PUBLIC_URL + "/cart";
            } else {
              handleClick(e);
            }
          }}
        >
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart
          cartData={cartData}
          currency={currency}
          deleteFromCart={deleteFromCart}
        />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={(e) => handleClick(e)}
        >
          {isLogin ? (
            userAvatar && userAvatar.avatar ? (
              <img
                src={userAvatar.avatar}
                alt="user avatar"
                className="avatar"
              />
            ) : (
              <img
                src="https://i.pinimg.com/564x/93/4e/37/934e37c613b24b4c7aa236644dd46fdc.jpg"
                alt="default"
                className="avatar"
              />
            )
          ) : (
            <i className="pe-7s-user-female" />
          )}
        </button>
        <div className="account-dropdown">
          {isLogin ? (
            <ul>
              <li>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  {t("my account")}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/my-order"}>
                  {t("my orders")}
                </Link>
              </li>
              <li>
                <Link to="" onClick={handleLogout}>
                  {t("logout")}
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  {t("login")}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  {t("register")}
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      {isLogin && <div className="same-style py-1">{userAvatar.username}</div>}
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.array,
  compareData: PropTypes.array,
  currency: PropTypes.object,
  iconWhiteClass: PropTypes.string,
  deleteFromCart: PropTypes.func,
  wishlistData: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
    cartData: state.cartData,
    wishlistData: state.wishlistData,
    compareData: state.compareData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconGroup);
