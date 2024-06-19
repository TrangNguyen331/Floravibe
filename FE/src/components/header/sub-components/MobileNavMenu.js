import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { logOutUser } from "../../../redux/actions/authAction";
const MobileNavMenu = ({ strings }) => {
  const token = useSelector((state) => state.auth.token);
  const { t } = useTranslation(["header"]);
  const dispatch = useDispatch();
  const history = useHistory();
  const { addToast } = useToasts();
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logOutUser(addToast));
    history.push(process.env.PUBLIC_URL + "/");
  };
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={process.env.PUBLIC_URL + "/"}>{t("home")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/shop"}>{t("shop")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/about"}>{t("about us")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/policy"}>{t("our policy")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/blog"}>{t("blog")}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            {t("contact_us")}
          </Link>
        </li>
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>{t("other")}</Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/cart"}>{t("cart")}</Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/checkout"}>
                {t("checkout")}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/wishlist"}>
                {t("wishlist")}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/compare"}>
                {t("compare")}
              </Link>
            </li>
            {token && (
              <>
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
              </>
            )}
            {token ? (
              <li>
                <Link to="" onClick={handleLogout}>
                  {t("logout")}
                </Link>
              </li>
            ) : (
              <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  {t("login/register")}
                </Link>
              </li>
            )}
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
